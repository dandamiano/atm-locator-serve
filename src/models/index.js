const sequelize = require("../config/db");

const db = {};

db.sequelize = sequelize;

db.ATM = require("./atm");
db.User = require("./user");
db.Feedback = require("./feedback");
db.Queue = require("./queue");
db.UserPreference = require("./userPreference");

db.ATM.hasMany(db.Feedback, { foreignKey: "atm_id", onDelete: "CASCADE" });
db.Feedback.belongsTo(db.ATM, { foreignKey: "atm_id" });

db.User.hasMany(db.UserPreference, { foreignKey: "userId", onDelete: "CASCADE" });
db.UserPreference.belongsTo(db.User, { foreignKey: "userId" });

module.exports = db;
