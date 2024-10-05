const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db_tasks");
const UserTasks = require("./User");

class Task extends Model {
  static associate(models) {
    // Определяем обратную ассоциацию, если нужно (либо оставьте пустым)
    Task.belongsTo(models.UserTasks, {
      foreignKey: "chatId", // Поле из модели UserTasks, к которому ссылается Task
      as: "User", // Псевдоним для использования в include
    });
  }
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    points: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompleted: {
      type: DataTypes.BOOLEAN,
    },
    chatId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Task",
  }
);

module.exports = Task;
