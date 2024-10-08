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
    const userInfo = await UserModel.create({
      chatId,
      firstName,
      lastName,
      username,
      avatarUrl,
    });

    userInfo.firstname = firstName;
    userInfo.lastname = lastName;
    await userInfo.save();

    console.log("Юзер добавлен:", userInfo);
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
        try {
          if (!Array.isArray(user.friendsId)) {
            user.friendsId = [];
          }
        } catch (error) {
          console.error("Ошибка при проверке массива:", error);
        }
        user.friendsId = [...user.friendsId, chatId];
        const saveResult = await user.save();
        console.log("Друг добавлен:", saveResult);
        //console.log("Друг добавлен:");
      } else {
        console.error("Пользователь не найден");
      }
    }
  } catch (error) {
    console.error("Ошибка:", error);
  }
};

/* createUser(
  "123432",
  "",
  "",
  "onlyUsername",
  "",
  "c2acddf6-2c6f-4213-a3db-80796e56046b"
); */

module.exports = createUser;
