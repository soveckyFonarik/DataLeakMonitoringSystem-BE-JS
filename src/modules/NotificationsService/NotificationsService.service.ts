import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly serviceAUrl: string;
  private readonly serviceBUrl: string;
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    // Получаем URL из .env через ConfigService
    this.serviceAUrl = this.configService.get<string>('SERVICE_A_URL');
    this.serviceBUrl = this.configService.get<string>('SERVICE_B_URL');
  }

  async sendToServiceA(payload: any): Promise<void> {
    try {
      const response = await this.httpService
        .post(this.serviceAUrl, payload)
        .toPromise();
      this.logger.log(
        `Уведомление отправлено в ServiceA, статус: ${response.status}`,
      );
    } catch (error) {
      this.logger.error('Ошибка отправки уведомления в ServiceA', error);
    }
  }

  async sendToServiceB(payload: any): Promise<void> {
    try {
      const response = await this.httpService
        .post(this.serviceBUrl, payload)
        .toPromise();
      this.logger.log(
        `Уведомление отправлено в ServiceB, статус: ${response.status}`,
      );
    } catch (error) {
      this.logger.error('Ошибка отправки уведомления в ServiceB', error);
    }
  }

  // Добавьте другие методы для других сервисов по аналогии
}
