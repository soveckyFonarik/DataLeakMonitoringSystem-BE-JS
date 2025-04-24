import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Если нужно использовать сервис в других модулях
})
export class UsersModule {}
