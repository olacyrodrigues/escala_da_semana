document.addEventListener("DOMContentLoaded", function () {
  // Função para calcular as datas de início e fim da semana
  function getWeekDates() {
    const today = new Date();
    const startDate = new Date(today);
    const endDate = new Date(today);

    startDate.setDate(today.getDate() - today.getDay() + 1); // Set to the start of the week (Monday)
    endDate.setDate(startDate.getDate() + 6); // Set to the end of the week (Sunday)

    const options = { day: "2-digit", month: "2-digit", year: "2-digit" };
    const startDateString = startDate.toLocaleDateString("pt-BR", options);
    const endDateString = endDate.toLocaleDateString("pt-BR", options);

    document.getElementById(
      "week-dates"
    ).textContent = `de ${startDateString} até ${endDateString}`;
  }

  // Função para carregar colaboradores
  function loadCollaborators() {
    fetch("/api/collaborators/all")
      .then((response) => response.json())
      .then((data) => {
        displayUsers(data);
      })
      .catch((error) =>
        console.error("Erro ao carregar colaboradores:", error)
      );
  }

  // Função para traduzir os dias da semana
  function translateDay(day) {
    const days = {
      saturday: "Sábado",
      sunday: "Domingo",
    };
    return days[day] || day;
  }

  // Função para exibir colaboradores na tabela
  function displayUsers(users) {
    // Ordenar colaboradores priorizando os setores "Superior Manutenção" e "Técnico Manutenção", depois por setor em ordem alfabética e, em caso de setores iguais, pelo dia da escala
    users.sort((a, b) => {
      const prioritySectors = ["Superior Manutenção", "Técnico Manutenção"];
      if (
        prioritySectors.includes(a.sector) &&
        !prioritySectors.includes(b.sector)
      ) {
        return -1;
      } else if (
        !prioritySectors.includes(a.sector) &&
        prioritySectors.includes(b.sector)
      ) {
        return 1;
      } else if (a.sector.localeCompare(b.sector) !== 0) {
        return a.sector.localeCompare(b.sector);
      } else {
        return a.day.localeCompare(b.day);
      }
    });

    const usersTable = document.getElementById("users-table");
    if (users.length === 0) {
      usersTable.innerHTML = "<p>Nenhum colaborador registrado.</p>";
      return;
    }
    usersTable.innerHTML = `
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Setor</th>
            <th>Escalado</th>
            <th>Contato</th>
            <th>Semana</th>
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
              <td>${
                user.day === "week"
                  ? document.getElementById("week-dates").textContent
                  : translateDay(user.day)
              }</td>
              <td>${user.timeIn} às ${user.timeOut}</td>
            </tr>
          `
            )
            .join("")}
        </tbody>
      </table>
    `;
  }

  // Carregar e exibir os colaboradores
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
});
