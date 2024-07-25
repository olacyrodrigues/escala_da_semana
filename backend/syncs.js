const sequelize = require("./database");
const User = require("./models/user");
const Collaborator = require("./models/collaborator");

async function syncDatabase() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    // Sincronizar todos os modelos com o banco de dados
    await sequelize.sync({ force: true }); // Use { force: true } apenas em desenvolvimento para recriar tabelas
    console.log("Database synchronized successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
