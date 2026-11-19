const { DataTypes } = require("sequelize");
const sequelize = require("../config");

const Schedule = sequelize.define("Schedule", {
    studentId: { type: DataTypes.INTEGER, allowNull: false },
    tutorId: { type: DataTypes.INTEGER, allowNull: false },
    subject: { type: DataTypes.STRING, allowNull: false },
    day: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: "Scheduled" } // Scheduled, Delivered, No Show, Canceled
});

module.exports = Schedule;
