import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { LeakCheckService } from './LeakCheckService.service';

@Module({
  providers: [LeakCheckService, PrismaService],
  exports: [LeakCheckService],
})
export class LeakCheckModule {}
