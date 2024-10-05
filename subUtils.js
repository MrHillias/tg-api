const axios = require("axios");

//токен бота
const botToken = "7074926259:AAH3uW4oybN23rQt_eD9pCqGdapqWz3qtYI";

async function checkSubscription(userId, chatId) {
  try {
    const response = await axios.get(
      `https://api.telegram.org/bot${botToken}/getChatMember`,
      {
        params: {
          chat_id: chatId,
          user_id: userId,
        },
      }
    );

    const memberStatus = response.data.result.status;

    if (
      memberStatus === "member" ||
      memberStatus === "administrator" ||
      memberStatus === "creator"
    ) {
      console.log("Пользователь подписан на канал.");
      return true;
    } else {
      console.log("Пользователь не подписан на канал.");
      return false;
    }
  } catch (error) {
    console.error(
      "Ошибка при проверке подписки:",
      error.response ? error.response.data : error.message
    );
  }
}

module.exports = checkSubscription;
