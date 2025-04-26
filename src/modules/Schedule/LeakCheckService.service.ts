import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LeakCheckService {
  private readonly logger = new Logger(LeakCheckService.name);

  constructor(private prisma: PrismaService) {}

  // Метод проверки утечек для всех UserPass
  async checkLeaks() {
    this.logger.log('Запущена проверка утечек паролей');

    // Получаем все UserPass (можно фильтровать по пользователю)
    const userPasses = await this.prisma.userPass.findMany();

    for (const pass of userPasses) {
      // Здесь ваша логика проверки утечки для pass.host и pass.login
      // Например, вызов внешнего API или локальная проверка

      const leaked = await this.isLeaked(pass.host, pass.login);

      if (pass.isLeaked !== leaked) {
        // Обновляем статус утечки, если изменился
        await this.prisma.userPass.update({
          where: { id: pass.id },
          data: { isLeaked: leaked },
        });
        this.logger.log(
          `Пароль id=${pass.id} для host=${pass.host} обновлен: isLeaked=${leaked}`,
        );
      }
    }

    this.logger.log('Проверка утечек завершена');
  }

  // Пример метода проверки утечки (замените на реальную логику)
  private async isLeaked(host: string, login: string): Promise<boolean> {
    // TODO: Реализуйте реальную проверку, например, запрос к сервису утечек
    // Для примера случайный результат
    return Math.random() < 0.1; // 10% вероятность "утечки"
  }

  // Запускать каждые 10 минут (можно настроить cron)
  @Cron(CronExpression.EVERY_10_MINUTES)
  handleCron() {
    this.checkLeaks().catch((err) => this.logger.error(err));
  }
}
