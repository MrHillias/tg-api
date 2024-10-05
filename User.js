const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db_tasks");

class UserTasks extends Model {}

UserTasks.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    chatId: { type: DataTypes.STRING, unique: true },
  },
  {
    sequelize,
    modelName: "UserTasks",
    tableName: "UserTasks",
  }
);

module.exports = UserTasks;
