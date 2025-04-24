import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserPassDto } from './dto/add-user-pass.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Post('add-pass')
  async addUserPass(@Body() dto: AddUserPassDto) {
    const userPass = await this.usersService.addUsersPassword(
      dto.userId,
      dto.host,
      dto.login,
      dto.password,
    );
    return userPass;
  }

  @Post('check-leaks/:userId')
  async checkPasswordLeaks(@Param('userId', ParseIntPipe) userId: number) {
    await this.usersService.checkPasswordLeaksForUser(userId);
    return { message: 'Password leaks checked' };
  }
}
