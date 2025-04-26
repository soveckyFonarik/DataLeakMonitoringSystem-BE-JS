import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async addUserPass(
    userId: number,
    data: { host: string; login: string; hashPass: string },
  ) {
    return this.prisma.userPass.create({
      data: {
        userId,
        host: data.host,
        login: data.login,
        hashPass: data.hashPass,
      },
    });
  }

  async updateUserPass(
    userId: number,
    userPassId: number,
    data: Partial<{
      host: string;
      login: string;
      hashPass: string;
      isLeaked: boolean;
    }>,
  ) {
    // Проверяем, что запись принадлежит пользователю
    const existing = await this.prisma.userPass.findUnique({
      where: { id: userPassId },
    });
    if (!existing) {
      throw new NotFoundException('UserPass not found');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.userPass.update({
      where: { id: userPassId },
      data,
    });
  }

  // Удаление UserPass по id, только если он принадлежит userId
  async deleteUserPass(userId: number, userPassId: number) {
    // Проверяем, что запись принадлежит пользователю
    const existing = await this.prisma.userPass.findUnique({
      where: { id: userPassId },
    });
    if (!existing) {
      throw new NotFoundException('UserPass not found');
    }
    if (existing.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.userPass.delete({
      where: { id: userPassId },
    });
  }

  // (Опционально) Получить все UserPass для конкретного пользователя
  async getUserPassesByUser(userId: number) {
    return this.prisma.userPass.findMany({
      where: { userId },
    });
  }
}
