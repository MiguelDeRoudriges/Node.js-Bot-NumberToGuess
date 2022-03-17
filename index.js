const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = '5201583839:AAF0jQHuOt1plJkIUH_FSVT4fZt24yqBNio';

const bot = new TelegramApi(token, {polling: true});

const chats = {}

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, `Сейчас я загадываю цифру от 0 до 9, а ты должен её угадать!`)
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, `Отгадайте число`, gameOptions)
    console.log(chats[chatId])
}

const start = () => {

    bot.setMyCommands( [
        {command: '/start', description: 'Начальное приветствие'},
        {command: '/info', description: 'Получить информацию о пользователе'},
        {command: '/game', description: 'Игра "Угадай число"'}
    ])

    bot.on('message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;

        if(text === '/start') {
            await bot.sendSticker(chatId, 'https://cdn.tlgrm.app/stickers/b09/073/b0907377-d110-34ec-8c12-a3ca987301ab/192/11.webp')
            return  bot.sendMessage(chatId, `Добро пожаловать в мой телеграм бот`)
        }
        if(text === '/info') {
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name}`)
        }
        if(text === '/game') {
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй ещё раз!')
    })

    bot.on('callback_query', async msg => {
       const data = msg.data;
       const chatId = msg.message.chat.id;

        console.log(data)

       if(data === '/again') {
           return startGame(chatId)
       }
           if (+data === chats[chatId]) {
               return await bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${chats[chatId]}!`, againOptions)
           } else {
               return await bot.sendMessage(chatId, `К сожалению, ты не угадал. Бот загадал цифру: ${chats[chatId]}`, againOptions)
           }

    })
}

start();

