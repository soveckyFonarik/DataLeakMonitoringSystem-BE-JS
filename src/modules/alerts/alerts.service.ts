import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AlertsService {
  constructor(private prisma: PrismaService) {}

  async getAlertsForUser(userId: number) {
    return this.prisma.alertUserServiceList.findMany({
      where: { userId },
      include: { typeService: true }, // Подгружаем данные о типе сервиса
    });
  }

  // Другие методы для работы с уведомлениями
}
