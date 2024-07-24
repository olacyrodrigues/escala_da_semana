const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const sequelize = require("./models");
const userRoutes = require("./routes/userRoutes");
const collaboratorRoutes = require("./routes/collaboratorRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.static(path.join(__dirname, "../assets")));

// Configurar sessão
app.use(
  session({
    secret: "secret-key", // substitua por uma chave secreta real
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Use secure: true em produção com HTTPS
  })
);

// Middleware para proteger rotas
function authMiddleware(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Configuração das rotas da API
app.use("/api/users", userRoutes);
app.use("/api/collaborators", collaboratorRoutes);

// Rota básica para verificar se o servidor está funcionando
app.get("/", (req, res) => {
  res.send("Servidor está funcionando!");
});

// Rotas para servir os arquivos HTML
app.get("/admin", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/admin.html"));
});

app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/login.html"));
});

app.get("/manutencao", authMiddleware, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/pages/manutencao.html"));
});

// Inicialização do servidor
sequelize.sync().then(() => {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
