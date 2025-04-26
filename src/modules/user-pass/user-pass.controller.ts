import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UserPassService } from './user-pass.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserPassDto, UpdateUserPassDto } from './dto/user-pass.dto';
import { Request } from 'express';

@UseGuards(AuthGuard('jwt')) // пример использования JWT Guard, чтобы получить userId из токена
@Controller('user-pass')
export class UserPassController {
  constructor(private readonly userPassService: UserPassService) {}

  // @Get()
  // async getAllUserPasses() {
  //   return this.userPassService.getAllUserPasses();
  // }

  // Получить все UserPass текущего пользователя
  @Get()
  async getUserPasses(@Req() req: Request) {
    const userId = req.user?.['userId']; // предполагается, что userId в токене
    return this.userPassService.getUserPassesByUser(userId);
  }

  // Добавить UserPass для текущего пользователя
  @Post()
  async addUserPass(@Req() req: Request, @Body() createDto: CreateUserPassDto) {
    const userId = req.user['userId'];
    return this.userPassService.addUserPass(userId, createDto);
  }

  // Обновить UserPass по id для текущего пользователя
  @Put(':id')
  async updateUserPass(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserPassDto,
  ) {
    const userId = req.user['userId'];
    return this.userPassService.updateUserPass(userId, id, updateDto);
  }

  // Удалить UserPass по id для текущего пользователя
  @Delete(':id')
  async deleteUserPass(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = req.user['userId'];
    return this.userPassService.deleteUserPass(userId, id);
  }
}
