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
    const inviteLink = `https://t.me/drive_official_bot/driveApp?startapp=ref_${uniqueCode}`;
    await UserInvite.create({ chatId: chatId, code: uniqueCode, inviteLink });
  } catch {
    console.error("Не удалось создать инвайты:", error);
  }
  try {
    if (friendUrl !== "") {
      const user = await UserInvite.findOne({ where: { code: friendUrl } });
      if (user) {
        if (!Array.isArray(user.friendsId)) {
          user.friendsId = [];
        }
        user.friendsId.push(chatId);
        const saveResult = await user.save();
        console.log("Друг добавлен:", saveResult);
      } else {
        console.error("Пользователь не найден");
      }
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

createUser(
  "1234321",
  "",
  "",
  "test",
  "",
  "aedbb335-473b-439d-9ec2-860fc46ebea5"
);

module.exports = createUser;
