const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const sequelize = require("./database");
const Collaborator = require("./models/collaborator");
const checkInactivity = require("./middlware/checkInactivity");
const cron = require("node-cron");
const User = require("./models/user");

const app = express();

const TWO_HOURS = 2 * 60 * 60 * 1000;

// Configuração de sessão
app.use(
  session({
    secret: "Inicie a sessão novamente.",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: TWO_HOURS },
  })
);

// Middleware para verificar inatividade
app.use(checkInactivity);

// Limpar tabelas de colaboradores toda segunda-feira à meia-noite
cron.schedule("0 0 * * 1", async () => {
  try {
    await Collaborator.destroy({ where: {} });
    console.log("Tabelas de colaboradores limpas com sucesso.");
  } catch (error) {
    console.error("Erro ao limpar tabelas de colaboradores:", error);
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// Rotas de usuário
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// Rotas de colaborador
const collaboratorRoutes = require("./routes/collaboratorRoutes");
app.use("/api/collaborators", collaboratorRoutes);

app.get("/api/users/all", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro ao buscar usuários." });
  }
});

app.get("/api/collaborators/all", async (req, res) => {
  try {
    const collaborators = await Collaborator.findAll();
    res.json(collaborators);
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error);
    res.status(500).json({ error: "Erro ao buscar colaboradores." });
  }
});

app.post("/api/collaborators/create", async (req, res) => {
  try {
    const { sector, employee, contact, timeIn, timeOut, day } = req.body;
    const newCollaborator = await Collaborator.create({
      sector,
      employee,
      contact,
      timeIn,
      timeOut,
      day,
    });
    res.json(newCollaborator);
  } catch (error) {
    console.error("Erro ao criar colaborador:", error);
    res.status(500).json({ error: "Erro ao criar colaborador." });
  }
});

app.delete("/api/collaborators/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Collaborator.destroy({ where: { id } });
    res.json({ message: "Colaborador removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover colaborador:", error);
    res.status(500).json({ error: "Erro ao remover colaborador." });
  }
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/index.html"));
});

app.get("/administrativo", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "../public/pages/administrativo.html"));
  } else {
    res.redirect("/login");
  }
});

app.get("/manutencao", (req, res) => {
  if (req.session.user) {
    res.sendFile(path.join(__dirname, "../public/pages/manutencao.html"));
  } else {
    res.redirect("/login");
  }
});

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
});
