const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Feedback = sequelize.define("Feedback", {  
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    atm_id: {
        type: DataTypes.UUID,
        allowNull: false
    },
    user_email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "resolved"),
        defaultValue: "pending"
    }
}, {
    timestamps: true
});

module.exports = Feedback; 
