const UserModel = require("./models");
const sequelize = require("./db");

const sequelize_invite = require("./db_invites");
const UserInvite = require("./models_invite");

const sequelize_tasks = require("./db_tasks");
const UserTasks = require("./User");
const Task = require("./models_tasks");

module.exports = { UserTasks, Task };

const { v4: uuidv4 } = require("uuid");

const token = "7074926259:AAH3uW4oybN23rQt_eD9pCqGdapqWz3qtYI";

const createUser = async (
  chatId,
  firstName,
  lastName,
  username,
  avatarUrl,
  friendUrl
) => {
  try {
    await UserModel.create({
      chatId,
      firstName,
      lastName,
      username,
      avatarUrl,
    });
  } catch (error) {
    console.error("Не получилось создать пользователя:", error);
  }
  try {
    const userTask = await UserTasks.create({ chatId: chatId });

    await Task.bulkCreate([
      {
        title: "Social butterfly",
        points: 1000,
        content: "Invite 3 friends",
        isCompleted: false,
        chatId: userTask.chatId,
        icon: "FaUserFriends",
        reason: "addFriends",
      },
      {
        title: "Avid reader",
        points: 500,
        content: "Subscribe to the Drive official channel",
        isCompleted: false,
        chatId: userTask.chatId,
        icon: "FaTelegramPlane",
        reason: "subscribeHuch",
      },
      {
        title: "Prolific farmer",
        points: 300,
        content: "Collect 3000 coins total",
        isCompleted: false,
        chatId: userTask.chatId,
        icon: "FaCoins",
        reason: "farm3000",
      },
    ]);
  } catch {
    console.error("Не получилось создать таски:", error);
  }
  try {
    const uniqueCode = uuidv4();
    const inviteLink = `https://t.me/drive/app?startapp=ref_${uniqueCode}`;
    await UserInvite.create({ chatId, code: uniqueCode, inviteLink });
    await UserInvite.save();
  } catch {
    console.error("Не удалось создать инвайты:", error);
  }
  if (friendUrl !== "") {
    //Заносим челика в список приглашенных
  }
};

module.exports = createUser;
