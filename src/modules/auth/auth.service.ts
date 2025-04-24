import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async validateUser(login: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { uniqueLogin: login },
    });
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.uniqueLogin, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createUser(login: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: {
        uniqueLogin: login,
        passwordHash: hashedPassword,
      },
    });
  }
}
