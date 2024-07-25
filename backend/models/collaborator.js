const { Model, DataTypes } = require("sequelize");
const sequelize = require("../database");

class Collaborator extends Model {}

Collaborator.init(
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
    sequelize,
    modelName: "Collaborator",
  }
);

module.exports = Collaborator;
