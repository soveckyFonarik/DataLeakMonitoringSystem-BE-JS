import { Module } from '@nestjs/common';
import { UserPassService } from './user-pass.service';
import { UserPassController } from './user-pass.controller';
import { PrismaService } from '../prisma/prisma.service'; // сервис Prisma

@Module({
  controllers: [UserPassController],
  providers: [UserPassService, PrismaService],
})
export class UserPassModule {}
