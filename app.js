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
const sequelize_tasks = require("./db_tasks");
const UserTasks = require("./User");
const Task = require("./models_tasks");

// Настройка ассоциаций
UserTasks.hasMany(Task, {
  foreignKey: "chatId",
  sourceKey: "chatId",
  as: "tasks",
});
Task.belongsTo(UserTasks, {
  foreignKey: "chatId",
  targetKey: "chatId",
  as: "owner",
});

module.exports = { UserTasks, Task };

const has24HoursPassed = require("./dateUtils");
const exactMinutesPassed = require("./dateUtils");

const checkSubscription = require("./subUtils");

const start = require("./botStart");
const sendButtons = require("./botStart");

const createUser = require("./BDcontentUtils");

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
  .then(() => console.log("Таблицы тасков синхронизированы"))
  .catch((err) => console.error("Ошибка синхронизации:", err));

// Endpoint для поиска пользователя по chatId
app.get("/users/:chatId", async (req, res) => {
  try {
    console.log(`Отправлен запрос "/users/:chatId"`);
    const user = await User.findOne({ where: { chatId: req.params.chatId } });
    if (user) {
      const eventDateStr = user.lastTimeGamesAdded;
      const eventHourStr = user.lastTimeRewardsAdded;
      // Проверяем, если eventDateStr или eventHourStr равен null, задаем текущее время
      if (!eventDateStr || !eventHourStr) {
        if (!eventDateStr) user.lastTimeGamesAdded = new Date();
        else user.lastTimeRewardsAdded = new Date();
        await user.save();
      } else {
        const currentTime = new Date();
        const userTimeGames = new Date(user.lastTimeGamessAdded);
        const userTimeRewards = new Date(user.lastTimeRewardsAdded);

        // Вычисляем разницу в миллисекундах
        const differenceInMillisecondsForGames = currentTime - userTimeGames;
        const differenceInMillisecondsForRewards =
          currentTime - userTimeRewards;
        // Переводим разницу в часы
        const differenceInHoursGames = Math.floor(
          differenceInMillisecondsForGames / (1000 * 60 * 60)
        );
        const differenceInHoursRewards = Math.floor(
          differenceInMillisecondsForRewards / (1000 * 60 * 60)
        );

        let shouldSave = false;

        // Проверяем условие обновления времени события
        if (differenceInHoursGames >= 24 && user.updatedToday) {
          user.updatedToday = false;
          console.log(`updatedToday`);
          shouldSave = true;
        }

        // Проверяем условие обновления наград
        if (differenceInHoursRewards >= 8 && user.rewardsUpdated) {
          user.rewardsUpdated = false;
          console.log(`rewardsUpdated`);
          shouldSave = true;
        }

        // Сохраняем объект пользователя, если это необходимо
        if (shouldSave) {
          await user.save();
        }
      }
      res.json(user);
    } else {
      res.status.json({ error: "chatId: 0" });
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
    lastTimeRewardsAdded,
    currentStreak,
    updatedToday,
    totalFarm,
    rewardsUpdated,
    farmPoints,
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
        lastTimeRewardsAdded,
        currentStreak,
        updatedToday,
        totalFarm,
        rewardsUpdated,
        farmPoints,
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

// Endpoint для получения серверного времени
app.get("/time", async (req, res) => {
  try {
    const serverTime = new Date();
    res.json({ serverTime: serverTime.toISOString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Endpoint для получения серверного времени
app.get("/time/:chatId", async (req, res) => {
  const user = await User.findOne({ where: { chatId: req.params.chatId } });
  try {
    console.log(
      "currentTime: " + Date() + "   userTime:" + user.lastTimeRewardsAdded
    );
    const currentTime = new Date();
    const userTime = new Date(user.lastTimeRewardsAdded);

    // Вычисляем разницу в миллисекундах
    const differenceInMilliseconds = currentTime - userTime;
    // Переводим разницу в минуты
    const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000);
    console.log("Diff: " + differenceInSeconds);
    res.json({ secondsPasses: differenceInSeconds });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Endpoint для получения друзей
app.get("/friends/:chatId", async (req, res) => {
  try {
    const user = await UserInvite.findOne({
      where: { chatId: req.params.chatId },
    });
    if (!user) {
      console.log("Пользователь не найден");
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    if (!user.friendsId) {
      console.log("friendsId пустой");
      return res.json([]);
    }

    const friends = user.friendsId; // Исправлено здесь
    console.log(friends);

    const results = await Promise.all(
      friends.map(async (currentFriend) => {
        return await User.findOne({ where: { chatId: currentFriend } });
      })
    );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// Endpoint для регистрации юзера
app.post("/user/reg", async (req, res) => {
  try {
    console.log(`Начат поиск`);
    const { chatId, name, lastname, username, avatarUrl, friendUrl } = req.body;

    console.log(chatId, name, lastname, username, avatarUrl, friendUrl);
    await createUser(chatId, name, lastname, username, avatarUrl, friendUrl);

    //sendButtons(chatId, name, username, avatarUrl);
    //await buttonCreate(chatId, firstname, username, avatar);

    console.log("Поиск юзера " + chatId);
    const userFin = await User.findOne({ where: { chatId: chatId } });
    console.log(userFin);
    res.json(userFin);

    //console.log(`Закончен поиск`);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании юзера" });
  }
});

// Endpoint для тестов
app.get("/", (req, res) => {
  res.send("API раб отает!");
});

//Endpoint для получения ссылки на приглашение
app.get("/invites/:chatId", async (req, res) => {
  try {
    const user = await UserInvite.findOne({
      where: { chatId: req.params.chatId },
    });
    if (user) {
      return res.json(user.inviteLink);
    }
  } catch (error) {
    return res.status(500).json({ error: "Ошибка при поиске пользователя" });
  }
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

//Подписки
app.get("/TaskCheck/Goida/:chatId", async (req, res) => {
  try {
    const userId = req.params.chatId;
    const subbed = await checkSubscription(userId, "@alldrivecrypto");
    if (subbed) {
      return res.send("Subbed");
    } else {
      return res.send("Not subbed");
    }
  } catch {
    res.status(500).json({ error: "Ошибка при проверке пользователя" });
  }
});

//таски

// Создание маршрута для получения тасков пользователя по его ID
app.get("/users/:chatId/tasks/", async (req, res) => {
  const userChatId = req.params.chatId;

  try {
    // Получаем пользователя с задачами, используя chatId
    const userWithTasks = await UserTasks.findOne({
      where: { chatId: userChatId },
      include: [{ model: Task, as: "tasks" }], // Псевдоним остается "tasks"
    });

    if (!userWithTasks) {
      return res.status(404).json({ message: "Пользователь не найден" });
    }

    return res.json(userWithTasks.tasks); // Возвращаем только задачи пользователя
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при получении задач" });
  }
});

// Создание маршрута для создания тасков пользователя
/* app.get("/users/tasks/:chatId", async (req, res) => {
  try {
    console.log(`Начато создание тасков`);
    const userChatId = req.params.chatId;
    const user = await UserTasks.create({ chatId: userChatId });

    await Task.bulkCreate([
      {
        title: "Social butterfly",
        points: 1000,
        content: "Invite 3 friends",
        isCompleted: false,
        chatId: user.chatId,
        icon: "FaUserFriends",
        reason: "addFriends",
      },
      {
        title: "Avid reader",
        points: 500,
        content: "Subscribe to the Drive official channel",
        isCompleted: false,
        chatId: user.chatId,
        icon: "FaTelegramPlane",
        reason: "subscribeHuch",
      },
      {
        title: "Prolific farmer",
        points: 300,
        content: "Collect 3000 coins total",
        isCompleted: false,
        chatId: user.chatId,
        icon: "FaCoins",
        reason: "farm3000",
      },
    ]);
    console.log(`Завершено создание тасков`);
    return res.status(200).json({ message: "Задачи добавлены" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при создании задач" });
  }
}); */

// Обработчик PUT-запроса для обновления задачи
app.put("/users/tasks/:taskId/", async (req, res) => {
  const taskId = req.params.taskId; // Получаем идентификатор задачи из параметров URL
  const { title, points, content, isCompleted, chatId, icon } = req.body; // Извлекаем данные обновления из тела запроса

  try {
    // Находим задачу по ID
    const task = await Task.findByPk(taskId);

    // Если задача не найдена, возвращаем 404
    if (!task) {
      return res.status(404).json({ message: "Задача не найдена" });
    }

    // Обновляем данные задачи
    await task.update({
      title,
      points,
      content,
      isCompleted,
      chatId,
      icon,
    });

    // Возвращаем обновленную задачу
    return res.json(task);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Ошибка при обновлении задачи" });
  }
});

// Запуск сервера
app.listen(PORT, () => {
  start();
  const HOST = process.env.HOST || "localhost";
  const baseUrl = `http://${HOST}:${PORT}`;
  console.log(`Сервер запущен по адресу ${baseUrl}`);
});
