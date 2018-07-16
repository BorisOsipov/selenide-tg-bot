const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const selenidePhrases = config.selenidePhrases.map(el => el.toLowerCase());
const watchGroupName = ['qa_automation'];

const forwardMessage = async (tgMessage) => {
  const isMessageToForward = selenidePhrases.find((phrase) => {
    const text = tgMessage.text.toLowerCase();
    return text.includes(phrase);
  });
  const isWatchedChannel = watchGroupName.find(name => name === tgMessage.chat.username);

  if (isWatchedChannel && isMessageToForward) {
    try {
      const message = `
From: ${tgMessage.from.first_name} ${tgMessage.from.last_name} @${tgMessage.from.username}

Text: ${tgMessage.text}

Link: https://t.me/${watchGroupName}/${tgMessage.message_id}
`;
      await bot.sendMessage(config.forwardToChanelId, message);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }
};

bot.on('message', forwardMessage);
