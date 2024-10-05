const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db_tasks");

class UserTasks extends Model {
  static associate(models) {
    // Определяем ассоциативную связь
    UserTasks.hasMany(models.Task, {
      foreignKey: "chatId", // Поле из модели Task, которое связывается с UserTasks
      as: "Tasks", // Псевдоним для использования в include
    });
  }
}

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
