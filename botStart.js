const tgBot = require("node-telegram-bot-api");

const token = "7074926259:AAH3uW4oybN23rQt_eD9pCqGdapqWz3qtYI";

const bot = new tgBot(token, { polling: true });

const createUser = require("./BDcontentUtils");
const buttonCreate = require("./StartButtonCreate");

const start = async () => {
  // Обработчик команды /start по ссылке
  bot.onText(/\/start (.+)/, async (msg) => {
    console.log("Перешли по ссылке", msg); // Выводим сообщение в консоль

    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";
    const username = msg.from.username || "";

    let avatar = "";

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
    const gameUrl = `https://daniel-jacky.github.io/DriveProject/#/?chatId=${chatId}&firstName=${encodeURIComponent(
      firstName
    )}&username=${encodeURIComponent(username)}&avatarUrl=${encodeURIComponent(
      avatar
    )}`;

    try {
      console.log("Game URL:", gameUrl); // Для отладки

      // Создайние кнопок
      const messageText = `Hello from Drive! 🌟 Your ultimate app for gaming and earning tokens with friends! 📱
  
  We're excited to launch our new mini app on Telegram! Begin collecting points today, and who knows what exciting rewards you'll soon grab with them! 🚀
  
  Have friends? Invite them along! The more, the merrier! 🌱
  
  Keep in mind: Drive is where speed rules and limitless opportunities await!`;

      console.log("Создаем кнопари"); // Выводим сообщение в консоль
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Subscribe to Drive!",
                url: "https://t.me/alldrivecrypto", // Укажите ссылку на ваш первый канал
              },
            ],
            [
              {
                text: "Play!",
                web_app: { url: gameUrl }, // Укажите ссылку на ваш второй канал
              },
            ],
          ],
        },
      };

      // Отправьте сообщение с кнопками
      bot.sendMessage(chatId, messageText, options);
    } catch (error) {
      console.log("Ошибка при создании кнопок: ", error);
    }
  });

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
    const gameUrl = `https://daniel-jacky.github.io/DriveProject/#/?chatId=${chatId}&firstName=${encodeURIComponent(
      firstName
    )}&username=${encodeURIComponent(username)}&avatarUrl=${encodeURIComponent(
      avatar
    )}`;

    try {
      console.log("Game URL:", gameUrl); // Для отладки

      // Создайние кнопок
      const messageText = `Hello from Drive! 🌟 Your ultimate app for gaming and earning tokens with friends! 📱
    
    We're excited to launch our new mini app on Telegram! Begin collecting points today, and who knows what exciting rewards you'll soon grab with them! 🚀
    
    Have friends? Invite them along! The more, the merrier! 🌱
    
    Keep in mind: Drive is where speed rules and limitless opportunities await!`;
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Subscribe to Drive!",
                url: "https://t.me/alldrivecrypto", // Укажите ссылку на ваш первый канал
              },
            ],
            [
              {
                text: "Play!",
                web_app: { url: gameUrl }, // Укажите ссылку на ваш второй канал
              },
            ],
          ],
        },
      };

      // Отправьте сообщение с кнопками
      bot.sendMessage(chatId, messageText, options);
    } catch (error) {
      console.log("Ошибка при создании кнопок: ", error);
    }
  });
};

/* function sendButtons(chatId, firstName, username, avatar) {
  const gameUrl = `https://daniel-jacky.github.io/DriveProject/#/?chatId=${chatId}&firstName=${encodeURIComponent(
    firstName
  )}&username=${encodeURIComponent(username)}&avatarUrl=${encodeURIComponent(
    avatar
  )}`;

  console.log("Game URL:", gameUrl); // Для отладки

  // Создайние кнопок
  const messageText = `Hello from Drive! 🌟 Your ultimate app for gaming and earning tokens with friends! 📱
  
  We're excited to launch our new mini app on Telegram! Begin collecting points today, and who knows what exciting rewards you'll soon grab with them! 🚀
  
  Have friends? Invite them along! The more, the merrier! 🌱
  
  Keep in mind: Drive is where speed rules and limitless opportunities await!`;
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: "Subscribe to Drive!",
            url: "https://t.me/alldrivecrypto", // Укажите ссылку на ваш первый канал
          },
        ],
        [
          {
            text: "Play!",
            web_app: { url: gameUrl }, // Укажите ссылку на ваш второй канал
          },
        ],
      ],
    },
  };

  // Отправьте сообщение с кнопками
  bot.sendMessage(chatId, messageText, options);
} */

module.exports = start;
//module.exports = sendButtons;
