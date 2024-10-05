const UserTasks = require("./User");
const Task = require("./Task");

// Настройка ассоциаций
UserTasks.hasMany(Task, { foreignKey: "userId" });
Task.belongsTo(UserTasks, { foreignKey: "userId" });

module.exports = { UserTasks, Task };
