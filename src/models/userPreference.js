const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user");

const UserPreference = sequelize.define("UserPreference", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
},
  accessibility: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  radius: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  waitTime: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  selectedServices: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: User, // 'User' model is referenced here
      key: "id",   // Foreign key pointing to the 'id' column in 'User' model
    },
  },
});

module.exports = UserPreference;
