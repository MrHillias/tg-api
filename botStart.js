const tgBot = require("node-telegram-bot-api");

const token = "7074926259:AAH3uW4oybN23rQt_eD9pCqGdapqWz3qtYI";

const bot = new tgBot(token, { polling: true });

const createUser = require("./BDcontentUtils");
const buttonCreate = require("./StartButtonCreate");

const start = async () => {
  // Команда /start
  bot.onText(/\/start/, async (msg) => {
    console.log("Received /start command:", msg); // Выводим сообщение в консоль

    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";
    const lastName = msg.from.last_name || "";
    const username = msg.from.username || "";

    let avatar = "";
    let ref = "";

    // Получение аватарки пользователя
    try {
      const profilePhotos = await bot.getUserProfilePhotos(msg.from.id);
      console.log("Game file:", profilePhotos.total_count);
      if (profilePhotos.total_count > 0) {
        const photoId = profilePhotos.photos[0][0].file_id; // Берем первое фото
        const file = await bot.getFile(photoId);
        avatar = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
        //user.avatar += avatarUrl;
      }
    } catch (error) {
      console.error("Error getting user profile photos:", error);
    }
    try {
      await createUser(chatId, firstName, lastName, username, avatar, ref);
    } catch (error) {
      console.error("Пользователь уже создан", error);
    }

    await buttonCreate(chatId, firstname, username, avatarUrl);
  });
};

module.exports = start;
