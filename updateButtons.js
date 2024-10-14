const UserModel = require("./models");

const updateButtons = async (chatId) => {
  try {
    console.log("На /start нажал" + chatId);
    const user = await UserModel.findOne({ where: { chatId: String(chatId) } });
    user.recievedButtons = true;
    await user.save();
  } catch {}
};

module.exports = updateButtons;
