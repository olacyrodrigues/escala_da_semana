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
      contactInput.setAttribute("pattern", "\\d*");
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
      input = input.replace(/^(\d{2})(\d)/g, "($1) $2");
      input = input.replace(/(\d{5})(\d)/, "$1-$2");
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

      const newRow = `
          <tr>
              <td>${sector}</td>
              <td>${employee}</td>
              <td>${contact}</td>
              <td>${timeIn} às ${timeOut}</td>
          </tr>
      `;

      const tableId =
        day === "saturday" ? "#table-saturday tbody" : "#table-sunday tbody";
      document.querySelector(tableId).insertAdjacentHTML("beforeend", newRow);

      document.getElementById("employeeForm").reset();
      $("#addModal").modal("hide");
      contactTypeSelect.dispatchEvent(new Event("change"));

      showToast("Colaborador adicionado com sucesso!", "success");
    });

  contactTypeSelect.value = "phone";
  contactTypeSelect.dispatchEvent(new Event("change"));

  // Theme switching logic
  const themeSwitch = document.getElementById("theme-switch");
  const themeStyle = document.getElementById("theme-style");

  const lightTheme = "styles.css";
  const darkTheme = "dark-mode.css";

  function switchTheme() {
    if (themeSwitch.checked) {
      themeStyle.setAttribute("href", darkTheme);
    } else {
      themeStyle.setAttribute("href", lightTheme);
    }
  }

  themeSwitch.addEventListener("change", switchTheme);

  const prefersDarkScheme = window.matchMedia(
    "(prefers-color-scheme: dark)"
  ).matches;
  if (prefersDarkScheme) {
    themeSwitch.checked = true;
    switchTheme();
  }
});
