import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AlertsModule } from './modules/alerts/alerts.module';
import { UserPassModule } from './modules/user-pass/user-pass.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    UsersModule,
    AuthModule,
    AlertsModule,
    UserPassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
