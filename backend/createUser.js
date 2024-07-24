const bcrypt = require("bcrypt");
const User = require(".backend/models/user");
const sequelize = require("./models");

async function createUser() {
  const username = "sistemas"; // Defina o nome de usuário desejado
  const password = "@sistemas789"; // Defina a senha desejada

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await sequelize.sync(); // Certifique-se de que o banco de dados está sincronizado

    const user = await User.create({
      username: username,
      password: hashedPassword,
    });

    console.log("Usuário criado com sucesso:", user.username);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
  } finally {
    await sequelize.close();
  }
}

createUser();
