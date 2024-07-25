document.addEventListener("DOMContentLoaded", function () {
  // Função para calcular as datas de sábado e domingo
  function getWeekendDates() {
    const today = new Date();
    const nextSaturday = new Date(today);
    const nextSunday = new Date(today);

    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
    nextSunday.setDate(nextSaturday.getDate() + 1);

    const options = {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    const saturdayDateString = nextSaturday.toLocaleDateString(
      "pt-BR",
      options
    );
    const sundayDateString = nextSunday.toLocaleDateString("pt-BR", options);

    document.getElementById(
      "saturday-date"
    ).textContent = ` ${saturdayDateString}`;
    document.getElementById("sunday-date").textContent = ` ${sundayDateString}`;
  }

  // Carregar colaboradores ao carregar a página
  function loadCollaborators() {
    fetch("/api/collaborators/all")
      .then((response) => response.json())
      .then((data) => {
        data.forEach((user) => {
          const newRow = `
            <tr data-id="${user.id}">
              <td>${user.sector}</td>
              <td>${user.employee}</td>
              <td>${user.contact}</td>
              <td>${user.timeIn} às ${user.timeOut}</td>
              <td class="actions-column"><button class="btn btn-danger btn-sm remove-button">Remover</button></td>
            </tr>
          `;
          const tableId =
            user.day === "saturday"
              ? "#table-saturday tbody"
              : "#table-sunday tbody";
          document
            .querySelector(tableId)
            .insertAdjacentHTML("beforeend", newRow);
        });
        checkTableActions("saturday");
        checkTableActions("sunday");
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
        const tableId =
          newUser.day === "saturday"
            ? "#table-saturday tbody"
            : "#table-sunday tbody";
        document.querySelector(tableId).insertAdjacentHTML("beforeend", newRow);
        checkTableActions(newUser.day);
      })
      .catch((error) => console.error("Erro ao adicionar colaborador:", error));
  }

  // Função para remover colaborador
  function removeCollaborator(id) {
    fetch(`/api/collaborators/delete/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        if (row) {
          row.remove();
          checkTableActions(
            row.closest("table").id === "table-saturday" ? "saturday" : "sunday"
          );
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
  const contactTypeSelect = document.getElementById("contact-type");
  const contactInput = document.getElementById("contact");

  document
    .getElementById("employeeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const contactType = contactTypeSelect.value;
      const contactInputValue = contactInput.value;

      if (contactType === "email" && !validateEmail(contactInputValue)) {
        alert("Por favor, insira um e-mail válido.");
        return;
      }

      const user = {
        sector: document.getElementById("sector").value,
        employee: document.getElementById("employee").value,
        contact: contactInputValue,
        timeIn: document.getElementById("time-in").value,
        timeOut: document.getElementById("time-out").value,
        day: document.getElementById("day").value,
      };
      addCollaborator(user);
      document.getElementById("employeeForm").reset();
      $("#addModal").modal("hide");
    });

  // Adicionar evento de input para formatar telefone
  contactInput.addEventListener("input", formatPhone);

  // Change handler for contact type
  contactTypeSelect.addEventListener("change", function () {
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
  contactTypeSelect.dispatchEvent(new Event("change"));

  // Manipulador para remover colaborador
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-button")) {
      const id = event.target.closest("tr").dataset.id;
      removeCollaborator(id);
    }
  });

  // Inicialização da página
  getWeekendDates();
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
});
