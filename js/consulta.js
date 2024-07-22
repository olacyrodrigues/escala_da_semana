document.addEventListener("DOMContentLoaded", function () {
  // Função para carregar usuários do localStorage
  function loadUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  // Função para exibir usuários na tabela
  function displayUsers(users) {
    const usersTable = document.getElementById("users-table");
    if (users.length === 0) {
      usersTable.innerHTML = "<p>Nenhum usuário registrado.</p>";
      return;
    }
    usersTable.innerHTML = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Setor</th>
            <th>Escalado</th>
            <th>Contato</th>
            <th>Dia</th>
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
              <td>${user.day}</td>
               <td>${user.timeIn} às ${user.timeOut}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  // Carregar e exibir os usuários
  const users = loadUsers();
  displayUsers(users);

  // Função para limpar usuários do localStorage
  function clearUsers() {
    localStorage.removeItem("users");
    displayUsers([]);
  }

  // Adicionar evento de clique ao botão de limpar usuários
  document.getElementById("clear-users").addEventListener("click", function () {
    if (confirm("Tem certeza de que deseja limpar todos os usuários?")) {
      clearUsers();
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
