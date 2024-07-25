document.addEventListener("DOMContentLoaded", function () {
  // Função para calcular as datas de início e fim da semana
  function getWeekDates() {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    startDate.setDate(today.getDate() - today.getDay() + 1); // Set to the start of the week (Monday)
    endDate.setDate(startDate.getDate() + 6); // Set to the end of the week (Sunday)

    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const startDateString = startDate.toLocaleDateString("pt-BR", options);
    const endDateString = endDate.toLocaleDateString("pt-BR", options);

    document.getElementById(
      "week-dates"
    ).textContent = `De ${startDateString} até ${endDateString}`;
  }

  // Carregar colaboradores ao carregar a página
  function loadCollaborators() {
    fetch("/api/collaborators/all")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((user) => {
          if (user.day === "week") {
            const newRow = `
              <tr data-id="${user.id}">
                <td>${user.sector}</td>
                <td>${user.employee}</td>
                <td>${user.contact}</td>
                <td>${user.timeIn} às ${user.timeOut}</td>
                <td class="actions-column"><button class="btn btn-danger btn-sm remove-button">Remover</button></td>
              </tr>
            `;
            document
              .querySelector("#table-week tbody")
              .insertAdjacentHTML("beforeend", newRow);
          }
        });
        checkTableActions();
      })
      .catch((error) =>
        console.error("Erro ao carregar colaboradores:", error)
      );
  }

  // Função para salvar colaborador
  function addCollaborator(user) {
    fetch("/api/collaborators/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => response.json())
      .then((newUser) => {
        const newRow = `
          <tr data-id="${newUser.id}">
            <td>${newUser.sector}</td>
            <td>${newUser.employee}</td>
            <td>${newUser.contact}</td>
            <td>${newUser.timeIn} às ${newUser.timeOut}</td>
            <td class="actions-column"><button class="btn btn-danger btn-sm remove-button">Remover</button></td>
          </tr>
        `;
        document
          .querySelector("#table-week tbody")
          .insertAdjacentHTML("beforeend", newRow);
        checkTableActions();
      })
      .catch((error) => console.error("Erro ao adicionar colaborador:", error));
  }

  // Função para remover colaborador
  function removeCollaborator(id) {
    fetch(`/api/collaborators/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then(() => {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          row.remove();
          checkTableActions();
        }
      })
      .catch((error) => console.error("Erro ao remover colaborador:", error));
  }

  // Função para formatar telefone
  function formatPhone(event) {
    let input = event.target.value.replace(/\D/g, "").substring(0, 11);
    if (input.length <= 10) {
      input = input.replace(/^(\d{2})(\d)/g, "($1) $2");
      input = input.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      input = input.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, "($1) $2 $3-$4");
    }
    event.target.value = input;
  }

  // Função para validar e-mail
  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  }

  // Inicialização do formulário de adição de colaborador
  document
    .getElementById("employeeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const contactType = document.getElementById("contact-type").value;
      const contactInput = document.getElementById("contact").value;

      if (contactType === "email" && !validateEmail(contactInput)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }

      const user = {
        sector: document.getElementById("sector").value,
        employee: document.getElementById("employee").value,
        contact: contactInput,
        timeIn: document.getElementById("time-in").value,
        timeOut: document.getElementById("time-out").value,
        day: "week", // Ajuste conforme necessário
      };
      addCollaborator(user);
      document.getElementById("employeeForm").reset();
      $("#addModal").modal("hide");
    });

  // Adicionar evento de input para formatar telefone
  const contactInput = document.getElementById("contact");
  document
    .getElementById("contact-type")
    .addEventListener("change", function () {
      if (this.value === "phone") {
        contactInput.setAttribute("type", "tel");
        contactInput.removeAttribute("pattern");
        contactInput.setAttribute("maxlength", "15");
        contactInput.setAttribute("placeholder", "(XX) X XXXX-XXXX");
        contactInput.removeEventListener("input", formatPhone);
        contactInput.addEventListener("input", formatPhone);
      } else {
        contactInput.setAttribute("type", "email");
        contactInput.removeAttribute("pattern");
        contactInput.removeAttribute("maxlength");
        contactInput.setAttribute("placeholder", "email@barceloscia.com.br");
        contactInput.removeEventListener("input", formatPhone);
      }
    });

  // Set the initial state for phone
  document.getElementById("contact-type").dispatchEvent(new Event("change"));

  // Manipulador para remover colaborador
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-button")) {
      const id = event.target.closest("tr").dataset.id;
      removeCollaborator(id);
    }
  });

  // Inicialização da página
  getWeekDates();
  loadCollaborators();

  // Theme switching logic
  const themeSwitch = document.getElementById("theme-switch");
  const themeStyle = document.getElementById("theme-style");

  const lightTheme = "../styles/styles.css";
  const darkTheme = "../styles/dark-mode.css";

  function switchTheme() {
    if (themeSwitch.checked) {
      themeStyle.setAttribute("href", darkTheme);
      localStorage.setItem("theme", "dark");
    } else {
      themeStyle.setAttribute("href", lightTheme);
      localStorage.setItem("theme", "light");
    }
  }

  themeSwitch.addEventListener("change", switchTheme);

  // Load the saved theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    themeSwitch.checked = true;
    themeStyle.setAttribute("href", darkTheme);
  } else {
    themeSwitch.checked = false;
    themeStyle.setAttribute("href", lightTheme);
  }

  // Set the initial state of the theme switch based on user preference
  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  if (savedTheme === null) {
    if (prefersDarkScheme) {
      themeSwitch.checked = true;
      switchTheme();
    }
  }
  function resetInactivityTimer() {
    fetch("/api/reset-inactivity-timer", { method: "POST" });
  }

  // Eventos para resetar o timer de inatividade
  window.addEventListener("mousemove", resetInactivityTimer);
  window.addEventListener("keydown", resetInactivityTimer);
  window.addEventListener("click", resetInactivityTimer);
  window.addEventListener("scroll", resetInactivityTimer);
});
