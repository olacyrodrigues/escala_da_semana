document.addEventListener("DOMContentLoaded", function () {
  const themeSwitch = document.getElementById("theme-switch");
  const themeStyle = document.getElementById("theme-style");

  const lightTheme = "../styles/login.css";
  const darkTheme = "../styles/login-dark-mode.css";

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

  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (!username || !password) {
        showToast("Por favor, preencha todos os campos.", "error");
        return;
      }

      if (document.getElementById("rememberMe").checked) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberMe");
      }

      // Fazer login via API
      fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Login bem-sucedido!") {
            showToast("Login bem-sucedido!", "success");
            window.location.href = "/admin"; // Redirecionar para a página admin
          } else {
            showToast(data.message, "error");
          }
        })
        .catch((error) => {
          console.error("Erro:", error);
          showToast("Erro ao fazer login.", "error");
        });
    });

  // Load saved credentials if rememberMe is checked
  if (localStorage.getItem("rememberMe") === "true") {
    document.getElementById("username").value =
      localStorage.getItem("username");
    document.getElementById("password").value =
      localStorage.getItem("password");
    document.getElementById("rememberMe").checked = true;
  }

  function showToast(message, type = "success") {
    const toastContainer =
      document.getElementById("toast-container") || createToastContainer();
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

  function createToastContainer() {
    const container = document.createElement("div");
    container.id = "toast-container";
    container.style.position = "absolute";
    container.style.top = "1rem";
    container.style.right = "1rem";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    container.style.minHeight = "200px";
    document.body.appendChild(container);
    return container;
  }
});
