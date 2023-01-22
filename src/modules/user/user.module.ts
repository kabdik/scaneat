import { Module } from '@nestjs/common';

import { UserEntity } from './entities/user.entity';

@Module({
  imports: [UserEntity],
})
export class UserModule {}
