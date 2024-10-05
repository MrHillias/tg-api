const sequelize = require("./db_tasks");
const { DataTypes } = require("sequelize");

const UserTasks = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chatId: { type: DataTypes.STRING, unique: true },
});

module.exports = UserTasks;
