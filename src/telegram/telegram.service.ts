import { Injectable } from '@nestjs/common'
import { getTelegramConfig } from 'src/config/telegram.config'
import { Telegraf } from 'telegraf'
import { type ExtraReplyMessage } from 'telegraf/typings/telegram-types'
import { type Telegram } from './telegram.interface'

@Injectable()
export class TelegramService {
	bot: Telegraf
	options: Telegram

	constructor() {
		this.options = getTelegramConfig()
		this.bot = new Telegraf(this.options.token)
	}

	async sendMessage(text: string, options?: ExtraReplyMessage, chatId: string = this.options.chatId) {
		await this.bot.telegram.sendMessage(chatId, text, {
			...options,
			parse_mode: 'HTML'
		})
	}

	async sendPhoto(photo: string, text?: string, chatId: string = this.options.chatId) {
		await this.bot.telegram.sendPhoto(chatId, photo, text ? {
			caption: text,
		} : {})
	}

	async getChatIds() {
		const response = await fetch('https://api.telegram.org/bot' + this.options.token + '/getUpdates', {
			method: 'GET'
		})

		return await response.json()
	}
}
