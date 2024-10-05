const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");

//Основная дб
const sequelize = require("./db");
const User = require("./models");

//Инвайты
const sequelize_invite = require("./db_invites");
const UserInvite = require("./models_invite");

//Таски
const sequelize_tasks = require("./db_invites");
const UserTasks = require("./User");
const Task = require("./models_tasks");

// Настройка ассоциаций
UserTasks.hasMany(Task, { foreignKey: "userId", as: "tasks" });
Task.belongsTo(UserTasks, { foreignKey: "userId", as: "owner" });

module.exports = { UserTasks, Task };

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
  .then(() => console.log("Основные таблицы синхронизированы"))
  .catch((err) => console.error("Ошибка синхронизации:", err));

// Проверка соединения с БД
sequelize_invite
  .authenticate()
  .then(() => console.log("Соединение с базой данных установлено"))
  .catch((err) => console.error("Невозможно подключиться к базе данных:", err));

// Синхронизация таблиц
sequelize_invite
  .sync() // Используйте эту строку, чтобы убедиться, что таблицы созданы
  .then(() => console.log("Таблицы инвайтов синхронизированы"))
  .catch((err) => console.error("Ошибка синхронизации:", err));

// Проверка соединения с БД
sequelize_tasks
  .authenticate()
  .then(() => console.log("Соединение с базой данных установлено"))
  .catch((err) => console.error("Невозможно подключиться к базе данных:", err));

// Синхронизация таблиц
sequelize_tasks
  .sync() // Используйте эту строку, чтобы убедиться, что таблицы созданы
  .then(() => console.log("Таблицы  тасковсинхронизированы"))
  .catch((err) => console.error("Ошибка синхронизации:", err));

// Endpoint для поиска пользователя по chatId
app.get("/users/:chatId", async (req, res) => {
  try {
    console.log(`Отправлен запрос "/users/:chatId"`);
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
        console.log(`hours passed = ` + hoursPassed);
        if (hoursPassed >= 24 && user.updatedToday) {
          user.updatedToday = false;
          console.log(`updatedToday`);
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
    const subbed = await checkSubscription(userId, "@hoochYou");
    if (subbed) {
      res.send("Subbed");
    } else {
      res.send("Not subbed");
    }
  } catch {
    res.status(500).json({ error: "Ошибка при проверке пользователя" });
  }
});

//таски

// Создание маршрута для получения тасков пользователя по его ID
app.get("/users/:chatId/tasks", async (req, res) => {
  const userId = req.params.chatId;

  try {
    // Получаем пользователя с задачами
    const userWithTasks = await UserTasks.findOne({
      where: { id: userId },
      include: Task, // Включаем связанные задачи
    });

    if (!userWithTasks) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.json(userWithTasks.Tasks); // Возвращаем только задачи пользователя
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при получении задач" });
  }
});

// Создание маршрута для создания тасков пользователя
app.get("/users/tasks/:chatId", async (req, res) => {
  try {
    console.log(`Начато создание тасков`);
    const userChatId = req.params.id;
    const user = await UserTasks.create({ chatId: userChatId });

    await Task.bulkCreate([
      {
        title: "Task 1",
        points: 10,
        content: "Fudg",
        isCompleted: false,
        userChatId: user.chatId,
      },
      {
        title: "Task 2",
        points: 100,
        content: "Amber",
        isCompleted: false,
        userChatId: user.chatId,
      },
    ]);
    console.log(`Завершено создание тасков`);
  } catch {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при создании задач" });
  }

  try {
    // Получаем пользователя с задачами
    console.log(`Ищем пользователя`);
    const userWithTasks = await UserTasks.findOne({
      where: { id: userId },
      include: Task, // Включаем связанные задачи
    });

    if (!userWithTasks) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.json(userWithTasks.Tasks); // Возвращаем только задачи пользователя
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при получении задач" });
  }
});

// Создание маршрута для получения тасков пользователя по его ID
app.get("/users/tasks/:chatId", async (req, res) => {
  const userId = req.params.id;

  try {
    // Получаем пользователя с задачами
    const userWithTasks = await UserTasks.findOne({
      where: { id: userId },
      include: Task, // Включаем связанные задачи
    });

    if (!userWithTasks) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.json(userWithTasks.Tasks); // Возвращаем только задачи пользователя
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при получении задач" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  const HOST = process.env.HOST || "localhost";
  const baseUrl = `http://${HOST}:${PORT}`;
  console.log(`Сервер запущен по адресу ${baseUrl}`);
});
