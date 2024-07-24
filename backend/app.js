const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const sequelize = require("./models");
const userRoutes = require("./routes/userRoutes");
const collaboratorRoutes = require("./routes/collaboratorRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Serve arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../assets")));

// Configuração das rotas da API
app.use("/api/users", userRoutes);
app.use("/api/collaborators", collaboratorRoutes);

// Rota básica para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Rotas para servir os arquivos HTML
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/admin.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

app.get("/manutencao", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/manutencao.html"));
});

// Inicialização do servidor
sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
  });
});
