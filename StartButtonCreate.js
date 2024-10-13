const tgBot = require("node-telegram-bot-api");

const token = "7074926259:AAH3uW4oybN23rQt_eD9pCqGdapqWz3qtYI";

const bot = new tgBot(token, { polling: true });
const buttonCreate = async (chatId, firstName, username, avatar) => {
  // Формируем URL с параметрами пользователя
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
            text: "Subscribe to drive channel!",
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
};

module.exports = buttonCreate;
