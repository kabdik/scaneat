import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { RestaurantOwnerEntity } from './entities/restaurant-owner.entity';
import { RestaurantOwnerService } from './restaurant-owner.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantOwnerEntity]), UserModule],
  providers: [RestaurantOwnerService],
  exports: [RestaurantOwnerService],
})
export class RestaurantOwnerModule {}
