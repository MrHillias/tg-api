const { Model, DataTypes } = require("sequelize");
const sequelize = require("./db_tasks");

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
      unique: true,
    },
    icon: { type: DataTypes.STRING, allowNull: true },
    reason: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    modelName: "Task",
  }
);

module.exports = Task;
