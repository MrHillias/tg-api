const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./db");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

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
  const { firstname, lastname, username, avatar, score } = req.body;

  try {
    const user = await User.findOne({ where: { chatId: req.params.chatId } });
    if (user) {
      // Обновление данных
      await user.update({ firstname, lastname, username, avatar, score });
      res.json(user);
    } else {
      res.status(404).json({ error: "Пользователь не найден" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обновлении пользователя" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});
