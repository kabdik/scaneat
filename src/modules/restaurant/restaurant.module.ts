import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryModule } from '../category/category.module';
import { RestaurantEntity } from './entities/restaurant.entity';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity]), CategoryModule],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
