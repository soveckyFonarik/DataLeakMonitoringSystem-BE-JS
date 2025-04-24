import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {}

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }
  async addUsersPassword(
    userId: number,
    host: string,
    login: string,
    password: string,
  ) {
    const hashPass = await bcrypt.hash(password, 10);
    const isLeaked = await this.checkPasswordLeak(password);
    return this.prisma.userPass.create({
      data: {
        userId,
        host,
        login,
        hashPass,
        isLeaked,
      },
    });
  }

  async checkPasswordLeak(password: string): Promise<boolean> {
    const sha1 = crypto
      .createHash('sha1')
      .update(password)
      .digest('hex')
      .toUpperCase();
    const prefix = sha1.slice(0, 5);
    const suffix = sha1.slice(5);

    const response = await this.httpService
      .get(`https://api.pwnedpasswords.com/range/${prefix}`)
      .toPromise();

    const hashes = response.data.split('\n');
    for (const line of hashes) {
      const [hashSuffix] = line.split(':');
      if (hashSuffix === suffix) {
        return true;
      }
    }
    return false;
  }

  // Другие методы для работы с пользователями
}
