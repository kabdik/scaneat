import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '../user/user.module';
import { RestaurantStaffEntity } from './entitites/restaurant-staff.entity';
import { RestaurantStaffController } from './restaurant-staff.controller';
import { RestaurantStaffService } from './restaurant-staff.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantStaffEntity]), UserModule],
  providers: [RestaurantStaffService],
  controllers: [RestaurantStaffController],
})
export class RestaurantStaffModule {}
