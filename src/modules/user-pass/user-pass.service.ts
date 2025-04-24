import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // предположим, что у вас есть PrismaService для работы с Prisma Client

@Injectable()
export class UserPassService {
  constructor(private prisma: PrismaService) {}

  async getAllUserPasses() {
    // Получаем все записи UserPass
    const userPasses = await this.prisma.userPass.findMany();

    // Преобразуем, чтобы вернуть хэш как "password" (например, для демонстрации)
    return userPasses.map((pass) => ({
      id: pass.id,
      userId: pass.userId,
      host: pass.host,
      login: pass.login,
      password: pass.hashPass, // здесь можно добавить логику "расшифровки" или преобразования
      isLeaked: pass.isLeaked,
    }));
  }
}
