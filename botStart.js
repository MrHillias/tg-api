const tgBot = require("node-telegram-bot-api");

const token = "7074926259:AAH3uW4oybN23rQt_eD9pCqGdapqWz3qtYI";

const bot = new tgBot(token, { polling: true });

const createUser = require("./BDcontentUtils");

const start = async () => {
  // Команда /start
  bot.onText(/\/start/, async (msg) => {
    console.log("Received /start command:", msg); // Выводим сообщение в консоль

    const chatId = msg.chat.id;
    const firstName = msg.from.first_name || "";
    const lastName = msg.from.last_name || "";
    const username = msg.from.username || "";

    let avatarUrl = "";
    let ref = "";

    // Получение аватарки пользователя
    try {
      const profilePhotos = await bot.getUserProfilePhotos(msg.from.id);
      console.log("Game file:", profilePhotos.total_count);
      if (profilePhotos.total_count > 0) {
        const photoId = profilePhotos.photos[0][0].file_id; // Берем первое фото
        const file = await bot.getFile(photoId);
        avatarUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
        //user.avatar += avatarUrl;
      }
    } catch (error) {
      console.error("Error getting user profile photos:", error);
    }
    try {
      await createUser(chatId, firstName, lastName, username, avatarUrl, ref);
    } catch (error) {
      console.error("Пользователь уже создан", error);
    }
    // Формируем URL с параметрами пользователя
    const gameUrl = `https://daniel-jacky.github.io/DriveProject/#/?chatId=${chatId}&firstName=${encodeURIComponent(
      firstName
    )}&username=${encodeURIComponent(username)}&avatarUrl=${encodeURIComponent(
      avatarUrl
    )}`;

    console.log("Game URL:", gameUrl); // Для отладки

    /*  try {
      console.log("Начинаем создавать кнопку");
      const options = {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Перейти в канал",
                url: "https://t.me/alldrivecrypto", // Укажите ссылку на ваш канал
              },
            ],
          ],
        },
      };
      // Отправьте сообщение с кнопкой
      bot.sendMessage(
        chatId,
        "Нажмите кнопку ниже, чтобы перейти в канал:",
        options
      );
      // Отправляем сообщение с кнопкой для запуска игры
      bot.sendMessage(chatId, "Запустить игру", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Play!",
                web_app: { url: gameUrl },
              },
            ],
          ],
        },
      });
    } catch (error) {
      console.log("Ошибка при создании кнопки: ", error);
    } */
    // Создайте кнопки
    const options = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Subscribe to drive channel!",
              url: "https://t.me/alldrivecrypto", // Укажите ссылку на ваш первый канал
            },
            {
              text: "Play!",
              web_app: { url: gameUrl }, // Укажите ссылку на ваш второй канал
            },
          ],
        ],
      },
    };

    // Отправьте сообщение с кнопками
    bot.sendMessage(chatId, "Добро пожаловать в D-R-I-V-E:", options);
  });
};

module.exports = start;
