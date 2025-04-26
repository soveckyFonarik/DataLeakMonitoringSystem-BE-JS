import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { LeakCheckService } from './LeakCheckService.service';

import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [PrismaModule, HttpModule],
  providers: [LeakCheckService],
  exports: [LeakCheckService],
})
export class LeakCheckModule {}
