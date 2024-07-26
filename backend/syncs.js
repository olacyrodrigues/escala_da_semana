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

    //   // Opcional: inserir alguns dados de exemplo para Users
    //   await User.bulkCreate([
    //     { username: "Alice", password: "password123" },
    //     { username: "Bob", password: "password123" },
    //     { username: "Charlie", password: "password123" },
    //   ]);
    //   console.log("Example users added successfully.");

    //   // Opcional: inserir alguns dados de exemplo para Collaborators
    //   await Collaborator.bulkCreate([
    //     {
    //       sector: "IT",
    //       employee: "John Doe",
    //       contact: "123456789",
    //       timeIn: "09:00",
    //       timeOut: "17:00",
    //       day: "Monday",
    //     },
    //     // Adicione mais colaboradores conforme necessário
    //   ]);
    //   console.log("Example collaborators added successfully.");
    // } catch (error) {
    console.error("Unable to connect to the database:", error);
  } finally {
    await sequelize.close();
  }
}

syncDatabase();
