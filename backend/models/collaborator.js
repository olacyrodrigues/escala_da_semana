// models/Collaborator.js
const { DataTypes } = require("sequelize");
const sequelize = require("./index");

const Collaborator = sequelize.define("Collaborator", {
  sector: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  employee: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  contact: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeIn: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timeOut: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  day: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Collaborator;
