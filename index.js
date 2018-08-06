const TelegramBot = require('node-telegram-bot-api');
const config = require('./config');

const token = process.env.TG_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const selenidePhrases = config.selenidePhrases.map(el => el.toLowerCase());
const { watchGroupNames, ignoredUsername } = config;

const forwardMessage = async (tgMessage) => {
  const isMessageToForward = selenidePhrases.find((phrase) => {
    if (!tgMessage.text) {
      return false;
    }
    const text = tgMessage.text.toLowerCase();
    return text.includes(phrase);
  });
  const isWatchedChannel = watchGroupNames.find(name => name === tgMessage.chat.username);
  const isIgnoredUsername = ignoredUsername.find(name => name === tgMessage.from.username);

  if (isWatchedChannel && isMessageToForward && !isIgnoredUsername) {
    try {
      const message = `
From: ${tgMessage.from.first_name} ${tgMessage.from.last_name} @${tgMessage.from.username}

Text: ${tgMessage.text}

Link: https://t.me/${tgMessage.chat.username}/${tgMessage.message_id}
`;
      await bot.sendMessage(config.forwardToChanelId, message);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
  }
};

bot.on('message', forwardMessage);
