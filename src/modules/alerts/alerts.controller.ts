import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { AlertsService } from './alerts.service';

@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get('user/:id')
  getAlertsForUser(@Param('id', ParseIntPipe) userId: number) {
    return this.alertsService.getAlertsForUser(userId);
  }
}
