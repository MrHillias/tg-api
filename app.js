const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const sequelize = require("./db");
const User = require("./models");
const has24HoursPassed = require("./dateUtils");

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

// Endpoint для поиска пользователя по chatId
app.get("/users/:chatId", async (req, res) => {
  try {
    const user = await User.findOne({ where: { chatId: req.params.chatId } });
    if (user) {
      const eventDateStr = user.lastTimeGamesAdded;
      // Проверяем, если eventDateStr равен null, задаем текущее время
      if (!eventDateStr) {
        user.eventDate = new Date();
        user.hoursPassed = 0;
      } else {
        user.hoursPassed = has24HoursPassed(eventDateStr);
      }
      res.json(user);
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при поиске пользователя" });
  }
});
//const currentDate = new Date();
//const formattedDate = formatDate(currentDate);
// Endpoint для обновления данных пользователя
app.put("/users/:chatId", async (req, res) => {
  const { firstname, lastname, username, avatar, score, gamesLeft } = req.body;

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

// Запуск сервера
app.listen(PORT, () => {
  const HOST = process.env.HOST || "localhost";
  const baseUrl = `http://${HOST}:${PORT}`;
  console.log(`Сервер запущен по адресу ${baseUrl}`);
});
