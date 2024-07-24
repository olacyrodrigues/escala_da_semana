document.addEventListener("DOMContentLoaded", function () {
  // Função para salvar usuários no localStorage
  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }

  // Função para carregar usuários do localStorage
  function loadUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  // Função para adicionar um usuário
  function addUser(user) {
    const users = loadUsers();
    users.push(user);
    saveUsers(users);
  }

  // Função para remover um usuário
  function removeUser(contact) {
    let users = loadUsers();
    users = users.filter((user) => user.contact !== contact);
    saveUsers(users);
  }

  // Função para mostrar notificação
  function showToast(message, type = "success") {
    const toastContainer = document.getElementById("toast-container");
    const toastId = `toast-${Date.now()}`;
    const toastHTML = `
          <div id="${toastId}" class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="3000">
              <div class="toast-header">
                  <strong class="mr-auto">Notificação</strong>
                  <small class="text-muted">Agora</small>
                  <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="toast-body ${
                type === "success" ? "text-success" : "text-danger"
              }">
                  ${message}
              </div>
          </div>
      `;
    toastContainer.insertAdjacentHTML("beforeend", toastHTML);
    $(`#${toastId}`)
      .toast("show")
      .on("hidden.bs.toast", function () {
        $(this).remove();
      });
  }

  // Função para verificar ações na tabela
  function checkTableActions(day) {
    const tableId = day === "saturday" ? "#table-saturday" : "#table-sunday";
    const table = document.querySelector(tableId);
    const tbody = table.querySelector("tbody");
    const hasRows = tbody.querySelectorAll("tr").length > 0;

    const actionsColumn = table.querySelector(".actions-column");
    if (hasRows) {
      actionsColumn.classList.remove("d-none");
    } else {
      actionsColumn.classList.add("d-none");
    }
  }

  // Função para calcular e exibir as datas de sábado e domingo
  function getNextWeekendDates() {
    const today = new Date();
    const nextSaturday = new Date(today);
    const nextSunday = new Date(today);

    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
    nextSunday.setDate(nextSaturday.getDate() + 1);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    document.getElementById("saturday-date").textContent =
      nextSaturday.toLocaleDateString("pt-BR", options);
    document.getElementById("sunday-date").textContent =
      nextSunday.toLocaleDateString("pt-BR", options);
  }

  getNextWeekendDates();

  // Manipulador do formulário de adição de usuário
  document
    .getElementById("employeeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();
      const user = {
        day: document.getElementById("day").value,
        sector: document.getElementById("sector").value,
        employee: document.getElementById("employee").value,
        contact: document.getElementById("contact").value,
        timeIn: document.getElementById("time-in").value,
        timeOut: document.getElementById("time-out").value,
      };
      addUser(user);

      const newRow = `
        <tr>
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
      document.querySelector(tableId).insertAdjacentHTML("beforeend", newRow);

      checkTableActions(user.day);

      document.getElementById("employeeForm").reset();
      $("#addModal").modal("hide");

      showToast("Colaborador adicionado com sucesso!", "success");
    });

  // Manipulador para remover usuário
  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-button")) {
      const row = event.target.closest("tr");
      const contact = row.querySelector("td:nth-child(3)").textContent;
      removeUser(contact);
      row.remove();
      showToast("Colaborador removido com sucesso!", "success");
      const tableId = row.closest("table").id;
      checkTableActions(tableId === "table-saturday" ? "saturday" : "sunday");
    }
  });

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

  // Inicialização do formulário de contato
  const contactTypeSelect = document.getElementById("contact-type");
  const contactInput = document.getElementById("contact");

  contactTypeSelect.addEventListener("change", function () {
    if (this.value === "phone") {
      contactInput.setAttribute("type", "tel");
      contactInput.removeAttribute("pattern");
      contactInput.setAttribute("maxlength", "15"); // Máximo de 15 caracteres
      contactInput.setAttribute("placeholder", "(XX) XXXXX-XXXX");
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

  function formatPhone(event) {
    let input = event.target.value.replace(/\D/g, "");
    if (input.length <= 10) {
      input = input.replace(/^(\d{2})(\d)/g, "($1) $2");
      input = input.replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      input = input.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
    }
    event.target.value = input;
  }

  contactTypeSelect.value = "phone";
  contactTypeSelect.dispatchEvent(new Event("change"));
});
