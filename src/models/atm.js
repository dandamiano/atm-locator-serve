const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const ATM = sequelize.define("ATM", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false
    },
    latitude: {
        type: DataTypes.DECIMAL(10, 8)
    },
    longitude: {
        type: DataTypes.DECIMAL(11, 8)
    },
    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active"
    },
    waitTime: {
        type: DataTypes.DOUBLE,
        allowNull: true
    },
    accessibility: {
        type: DataTypes.BOOLEAN
    },
    services: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: {
          withdrawal: true,
          "balance inquiry": true,
          cardless: false,
          deposit: false
        }
      }
      
}, {
    timestamps: true
});

module.exports = ATM;
