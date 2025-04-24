import { Controller, Get } from '@nestjs/common';
import { UserPassService } from './user-pass.service';

@Controller('user-pass')
export class UserPassController {
  constructor(private readonly userPassService: UserPassService) {}

  @Get()
  async getAllUserPasses() {
    return this.userPassService.getAllUserPasses();
  }
}
