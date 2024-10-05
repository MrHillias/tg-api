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
  },
  {
    sequelize,
    modelName: "Task",
  }
);

// Определение ассоциации
Task.belongsTo(UserTasks, { foreignKey: "userId", as: "owner" });

module.exports = Task;
