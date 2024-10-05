const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

const sequelize = require("./db");
const User = require("./models");

const sequelize_invite = require("./db_invites");
const UserInvite = require("./models_invite");

const has24HoursPassed = require("./dateUtils");

const checkSubscription = require("./subUtils");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Разрешаем все источники
app.use(cors());

// Проверка соединения с БД
sequelize
  .authenticate()
  .then(() => console.log("Соединение с базой данных установлено"))
  .catch((err) => console.error("Невозможно подключиться к базе данных:", err));

// Синхронизация таблиц
sequelize
  .sync() // Используйте эту строку, чтобы убедиться, что таблицы созданы
  .then(() => console.log("Таблицы синхронизированы"))
  .catch((err) => console.error("Ошибка синхронизации:", err));

// Проверка соединения с БД
sequelize_invite
  .authenticate()
  .then(() => console.log("Соединение с базой данных установлено"))
  .catch((err) => console.error("Невозможно подключиться к базе данных:", err));

// Синхронизация таблиц
sequelize_invite
  .sync() // Используйте эту строку, чтобы убедиться, что таблицы созданы
  .then(() => console.log("Таблицы синхронизированы"))
  .catch((err) => console.error("Ошибка синхронизации:", err));

// Endpoint для поиска пользователя по chatId
app.get("/users/:chatId", async (req, res) => {
  try {
    const user = await User.findOne({ where: { chatId: req.params.chatId } });
    if (user) {
      const eventDateStr = user.lastTimeGamesAdded;
      // Проверяем, если eventDateStr равен null, задаем текущее время
      if (!eventDateStr) {
        user.lastTimeGamesAdded = new Date();
        user.hoursPassed = 0;
        await user.save();
      } else {
        const hoursPassed = has24HoursPassed(eventDateStr);
        if (hoursPassed >= 24 && user.updatedToday == true) {
          user.updatedToday = false;
          await user.save();
        }
      }
      res.json(user);
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при поиске пользователя" });
  }
});
// Endpoint для обновления данных пользователя
app.put("/users/:chatId", async (req, res) => {
  const {
    firstname,
    lastname,
    username,
    avatar,
    score,
    gamesLeft,
    lastTimeGamesAdded,
    currentStreak,
    updatedToday,
  } = req.body;

  try {
    const user = await User.findOne({ where: { chatId: req.params.chatId } });
    if (user) {
      // Обновление данных
      await user.update({
        firstname,
        lastname,
        username,
        avatar,
        score,
        gamesLeft,
        lastTimeGamesAdded,
        currentStreak,
        updatedToday,
      });
      res.json(user);
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении пользователя" });
  }
});

// Endpoint для получения всех пользователей
app.get("/users", async (req, res) => {
  try {
    console.log(`Отправлен запрос users`);
    const users = await User.findAll(); // Получаем всех пользователей
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Endpoint для тестов
app.get("/", (req, res) => {
  res.send("API раб отает!");
});

//Инвайты

// Добавьте новый элемент в массив
//record.yourArrayColumn.push(newItem);

/* app.post("/invites/:chatId", async (req, res) => {
  const chatId = req.params.chatId;
  const uniqueCode = uuidv4();
  const inviteLink = `https://t.me/drive/app?startapp=ref_${uniqueCode}`;
  try {
    await UserInvite.create({ chatId, code: uniqueCode, inviteLink });
    res.status(201).json({ inviteLink });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
}); */

app.get("/invites/:chatId", async (req, res) => {
  try {
    const user = await UserInvite.findOne({
      where: { chatId: req.params.chatId },
    });
    if (user) {
      res.json(user.inviteLink);
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при поиске пользователя" });
  }
});

//Подписки
app.get("/TaskCheck/Goida/:chatId", async (req, res) => {
  try {
    const userId = req.params.chatId;
    const subbed = checkSubscription(userId, "@goidasexual");
    if (subbed) {
      res.send("Subbed");
    } else {
      res.send("Not subbed");
    }
  } catch {
    res.status(500).json({ error: "Ошибка при проверке пользователя" });
  }
});

app.get("/TaskCheck/X/:chatId", async (req, res) => {
  const userId = req.params.chatId;
  checkSubscription(userId, "@meme171k");
});

// Запуск сервера
app.listen(PORT, () => {
  const HOST = process.env.HOST || "localhost";
  const baseUrl = `http://${HOST}:${PORT}`;
  console.log(`Сервер запущен по адресу ${baseUrl}`);
});
