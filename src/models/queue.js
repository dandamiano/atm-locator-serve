const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Queue = sequelize.define('Queue', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    atm_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    avg_trans_time: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    count: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
},{
    timestamps: true
});
  
module.exports = Queue;