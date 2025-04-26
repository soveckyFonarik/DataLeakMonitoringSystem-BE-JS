import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class LeakCheckService {
  private readonly logger = new Logger(LeakCheckService.name);

  private readonly hibpApiKey = process.env.HIBP_API_KEY;
  private readonly breachDirectoryApiKey = process.env.BREACHDIRECTORY_API_KEY;

  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCron() {
    this.logger.log('Запущена периодическая проверка утечек');
    try {
      await this.checkLeaks();
    } catch (error) {
      this.logger.error('Ошибка при проверке утечек', error);
    }
  }

  async checkLeaks() {
    const userPasses = await this.prisma.userPass.findMany();

    for (const pass of userPasses) {
      const leaked = await this.checkLeakForPass(pass.host, pass.login);

      if (pass.isLeaked !== leaked) {
        await this.prisma.userPass.update({
          where: { id: pass.id },
          data: { isLeaked: leaked },
        });
        this.logger.log(
          `Пароль id=${pass.id} для host=${pass.host} обновлен: isLeaked=${leaked}`,
        );
      }
    }
  }

  // Проверка утечки через оба API
  private async checkLeakForPass(
    host: string,
    login: string,
  ): Promise<boolean> {
    // Проверяем через HIBP
    const hibpLeaked = await this.checkHIBP(login);

    // Проверяем через BreachDirectory
    const breachDirLeaked = await this.checkBreachDirectory(host, login);

    return hibpLeaked || breachDirLeaked;
  }

  // Проверка по Have I Been Pwned по email/login
  private async checkHIBP(account: string): Promise<boolean> {
    if (!this.hibpApiKey) {
      this.logger.warn('HIBP API key не задан, пропускаем проверку');
      return false;
    }

    const url = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(account)}?truncateResponse=true`;

    try {
      const response$ = this.httpService.get(url, {
        headers: {
          'hibp-api-key': this.hibpApiKey,
          'user-agent': 'YourAppName', // обязательно
        },
        validateStatus: (status) => status === 200 || status === 404,
      });
      const response = await firstValueFrom(response$);

      if (
        response.status === 200 &&
        Array.isArray(response.data) &&
        response.data.length > 0
      ) {
        this.logger.log(`HIBP: Найдены утечки для аккаунта ${account}`);
        return true;
      }
      // 404 - не найдено утечек
      return false;
    } catch (error) {
      this.logger.error(`Ошибка HIBP для ${account}:`, error);
      return false;
    }
  }

  // Проверка по BreachDirectory по host и login
  private async checkBreachDirectory(
    host: string,
    login: string,
  ): Promise<boolean> {
    if (!this.breachDirectoryApiKey) {
      this.logger.warn('BreachDirectory API key не задан, пропускаем проверку');
      return false;
    }

    const url = `https://breachdirectory.p.rapidapi.com/?func=auto&term=${encodeURIComponent(login)}@${encodeURIComponent(host)}`;

    try {
      const response$ = this.httpService.get(url, {
        headers: {
          'X-RapidAPI-Key': this.breachDirectoryApiKey,
          'X-RapidAPI-Host': 'breachdirectory.p.rapidapi.com',
          'user-agent': 'YourAppName',
        },
        validateStatus: (status) => status === 200 || status === 404,
      });
      const response = await firstValueFrom(response$);

      if (
        response.status === 200 &&
        response.data &&
        response.data.status === 'found'
      ) {
        this.logger.log(`BreachDirectory: Найдены утечки для ${login}@${host}`);
        return true;
      }
      return false;
    } catch (error) {
      this.logger.error(`Ошибка BreachDirectory для ${login}@${host}:`, error);
      return false;
    }
  }
}
