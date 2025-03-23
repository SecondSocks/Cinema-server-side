import { Controller, Get } from '@nestjs/common'
import { UseAuth } from 'src/auth/guards/auth.guard'
import { TelegramService } from './telegram.service'

@Controller('telegram')
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@UseAuth('admin')
	@Get()
	async getChatIds() {
		return this.telegramService.getChatIds()
	}
}
