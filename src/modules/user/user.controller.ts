import { Body, Controller, Post } from '@nestjs/common';

import { CreateUserBodyDto } from './dto/create-user.body.dto';
import type { User } from './interfaces/user.interface';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService:UserService) {}

  @Post('create')
  public async createUser(@Body() data:CreateUserBodyDto):Promise<User> {
    return this.userService.createUser(data);
  }
}
