import { Controller, Post, Body } from '@nestjs/common';
import { NotificationsService } from './NotificationsService.service';

@Controller('events')
export class EventsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('some-event')
  async handleEvent(@Body() data: any) {
    // Логика обработки события

    // Отправляем уведомления в сторонние сервисы
    await this.notificationsService.sendToServiceA(data);
    await this.notificationsService.sendToServiceB(data);

    return { status: 'ok' };
  }
}
