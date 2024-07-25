const Sequelize = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite",
});

const Collaborator = require("./collaborator");
const User = require("./user");

module.exports = {
  sequelize,
  Collaborator,
  User,
};
