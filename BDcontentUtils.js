const UserModel = require("./models");

const UserInvite = require("./models_invite");

const UserTasks = require("./User");
const Task = require("./models_tasks");

module.exports = { UserTasks, Task };

const { v4: uuidv4 } = require("uuid");

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
    const userTasks = await UserTasks.create({ chatId: chatId });

    await Task.bulkCreate([
      {
        title: "Social butterfly",
        points: 1000,
        content: "Invite 3 friends",
        isCompleted: false,
        chatId: userTasks.chatId,
        icon: "FaUserFriends",
        reason: "addFriends",
      },
      {
        title: "Avid reader",
        points: 500,
        content: "Subscribe to the Drive official channel",
        isCompleted: false,
        chatId: userTasks.chatId,
        icon: "FaTelegramPlane",
        reason: "subscribeHuch",
      },
      {
        title: "Prolific farmer",
        points: 300,
        content: "Collect 3000 coins total",
        isCompleted: false,
        chatId: userTasks.chatId,
        icon: "FaCoins",
        reason: "farm3000",
      },
    ]);
  } catch {
    console.error("Не получилось создать таски:", error);
  }
  try {
    const uniqueCode = uuidv4();
    const inviteLink = `https://t.me/drive_official_bot?startapp=${uniqueCode}`;
    await UserInvite.create({ chatId: chatId, code: uniqueCode, inviteLink });
  } catch {
    console.error("Не удалось создать инвайты:", error);
  }
  if (friendUrl !== "") {
    //Заносим челика в список приглашенных
    const user = await UserInvite.findOne({
      where: { code: friendUrl },
    });
    if (user) {
      console.log("Пригласитель найден");
      user.friendsId.push(friendUrl);
      await user.save;
    } else {
      console.error("Пользователь не найден");
    }
  }
};

//createUser("1234321", "", "", "", "", "");

module.exports = createUser;
