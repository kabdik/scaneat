import { Controller, Get, Param } from '@nestjs/common';

import type { CategoryWithProduct } from '../category/interfaces/category.interface';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurant:RestaurantService) {}

  @Get(':restaurantSlug/menu')
  public async getMenu(@Param('restaurantSlug') restaurantSlug: string): Promise<CategoryWithProduct[]> {
    return this.restaurant.getMenu(restaurantSlug);
  }
}
