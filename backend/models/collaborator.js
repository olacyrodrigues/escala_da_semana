// backend/models/collaborator.js
const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../database");

const Collaborator = sequelize.define(
  "Collaborator",
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = Collaborator;
