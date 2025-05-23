import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly serviceAUrl: string;
  private readonly serviceBUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.serviceAUrl = this.configService.get<string>('SERVICE_A_URL');
    this.serviceBUrl = this.configService.get<string>('SERVICE_B_URL');
  }

  async sendToServiceA(payload: any): Promise<void> {
    try {
      const response$ = this.httpService.post(this.serviceAUrl, payload);
      const response = await firstValueFrom(response$);
      this.logger.log(
        `Уведомление отправлено в ServiceA, статус: ${response.status}`,
      );
    } catch (error) {
      this.logger.error('Ошибка отправки уведомления в ServiceA', error);
    }
  }

  async sendToServiceB(payload: any): Promise<void> {
    try {
      const response$ = this.httpService.post(this.serviceAUrl, payload);
      const response = await firstValueFrom(response$);
      this.logger.log(
        `Уведомление отправлено в ServiceA, статус: ${response.status}`,
      );
    } catch (error) {
      this.logger.error('Ошибка отправки уведомления в ServiceA', error);
    }
  }
}
