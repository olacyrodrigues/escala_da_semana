const Sequelize = require("sequelize");
const sequelize = require("./index").sequelize;

const User = sequelize.define("User", {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = User;
