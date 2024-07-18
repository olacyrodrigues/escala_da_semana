document.addEventListener("DOMContentLoaded", function () {
  function getNextWeekendDates() {
    const today = new Date();
    const nextSaturday = new Date();
    const nextSunday = new Date();

    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7));
    nextSunday.setDate(nextSaturday.getDate() + 1);

    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    document.getElementById("next-saturday").textContent =
      nextSaturday.toLocaleDateString("pt-BR", options);
    document.getElementById("next-sunday").textContent =
      nextSunday.toLocaleDateString("pt-BR", options);
  }

  getNextWeekendDates();

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

  document
    .getElementById("employeeForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const day = document.getElementById("day").value;
      const sector = document.getElementById("sector").value;
      const employee = document.getElementById("employee").value;
      const contact = document.getElementById("contact").value;
      const timeIn = document.getElementById("time-in").value;
      const timeOut = document.getElementById("time-out").value;

      if (!day || !sector || !employee || !contact || !timeIn || !timeOut) {
        showToast("Por favor, preencha todos os campos.", "error");
        return;
      }

      const newRow = document.createElement("tr");
      newRow.innerHTML = `
        <td>${sector}</td>
        <td>${employee}</td>
        <td>${contact}</td>
        <td>${timeIn} às ${timeOut}</td>
        <td class="actions-column"><button class="btn btn-danger btn-sm remove-button">Remover</button></td>
      `;

      const tableId =
        day === "saturday" ? "#table-saturday tbody" : "#table-sunday tbody";
      document.querySelector(tableId).appendChild(newRow);

      checkTableActions(day);

      document.getElementById("employeeForm").reset();
      $("#addModal").modal("hide");
      contactTypeSelect.dispatchEvent(new Event("change"));

      showToast("Colaborador adicionado com sucesso!", "success");
    });

  contactTypeSelect.value = "phone";
  contactTypeSelect.dispatchEvent(new Event("change"));

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("remove-button")) {
      const row = event.target.closest("tr");
      const tableId = row.closest("table").id;
      row.remove();
      showToast("Colaborador removido com sucesso!", "success");
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
});
