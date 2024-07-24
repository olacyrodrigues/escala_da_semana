document.addEventListener("DOMContentLoaded", function () {
  const themeSwitch = document.getElementById("theme-switch");
  const themeStyle = document.getElementById("theme-style");

  const lightTheme = "/styles/login.css";
  const darkTheme = "/styles/login-dark-mode.css";

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
    .addEventListener("submit", async function (event) {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      if (!username || !password) {
        showToast("Por favor, preencha todos os campos.", "error");
        return;
      }

      try {
        const response = await fetch("/api/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
          showToast("Login bem-sucedido!", "success");
          setTimeout(() => {
            window.location.href = "/admin";
          }, 1000);
        } else {
          const result = await response.json();
          showToast(result.message, "error");
        }
      } catch (error) {
        showToast("Erro ao fazer login. Tente novamente.", "error");
      }
    });

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
