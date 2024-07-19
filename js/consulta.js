document.addEventListener("DOMContentLoaded", function () {
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

  function loadUsers() {
    const usersTable = document.getElementById("users-table");

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    if (users.length === 0) {
      usersTable.innerHTML = "<p>Nenhum usuário registrado.</p>";
      return;
    }

    const table = document.createElement("table");
    table.classList.add("table", "table-bordered");
    table.innerHTML = `
          <thead>
              <tr>
                  <th>Setor</th>
                  <th>Escalado</th>
                  <th>Contato</th>
                  <th>Horário</th>
              </tr>
          </thead>
          <tbody>
              ${users
                .map(
                  (user) => `
                  <tr>
                      <td>${user.sector}</td>
                      <td>${user.employee}</td>
                      <td>${user.contact}</td>
                      <td>${user.timeIn} às ${user.timeOut}</td>
                  </tr>
              `
                )
                .join("")}
          </tbody>
      `;
    usersTable.appendChild(table);
  }

  loadUsers();
});
