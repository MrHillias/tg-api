const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db_tasks");
const UserTasks = require("./User");

class Task extends Model {}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false, // Название задачи обязательно
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false, // Количество очков обязательно
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false, // Название задачи обязательно
    },
    isCompleted: {
      type: DataTypes.BOOLEAN, // Статус выполнения
    },
  },
  {
    sequelize,
    modelName: "Task",
  }
);

// Определение ассоциации
Task.belongsTo(UserTasks, { foreignKey: "userChatId" }); // task будет иметь поле userChatId, чтобы ссылаться на пользователя

module.exports = Task;
