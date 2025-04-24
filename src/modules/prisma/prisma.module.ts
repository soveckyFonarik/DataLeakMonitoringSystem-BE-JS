import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Глобальный модуль, чтобы не импортировать везде
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
