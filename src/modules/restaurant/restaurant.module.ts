import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { RestaurantOwnerModule } from '../restaurant-owner/restaurant-owner.module';
import { RestaurantManagementController } from './controllers/restaurant-management.controller';
import { RestaurantController } from './controllers/restaurant.controller';
import { RestaurantEntity } from './entities/restaurant.entity';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity]), CategoryModule, RestaurantOwnerModule],
  controllers: [RestaurantController, RestaurantManagementController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
