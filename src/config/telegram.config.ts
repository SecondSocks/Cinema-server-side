import { Telegram } from 'src/telegram/telegram.interface'

export const getTelegramConfig = (): Telegram => ({
	chatId: '5195876100',
	token: process.env.BOT_TOKEN
})
