const sequelize = require("./db");
const { DataTypes } = require("sequelize");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  chatId: { type: DataTypes.STRING, unique: true },
  firstname: { type: DataTypes.STRING, nullable: true },
  lastname: { type: DataTypes.STRING, nullable: true },
  username: { type: DataTypes.STRING, nullable: true },
  avatar: { type: DataTypes.STRING, nullable: true },
  score: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
  gamesLeft: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 5 },
});

module.exports = User;
