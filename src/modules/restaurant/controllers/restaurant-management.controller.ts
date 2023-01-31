import { Body, Controller, Get, Param, Patch } from '@nestjs/common';

import { UseAuth } from '@/common/decorators/auth.decorator';
import { CategoryService } from '@/modules/category/category.service';
import type { Category } from '@/modules/category/interfaces/category.interface';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';

import { UpdateRestaurantBodyDto } from '../dto/update-restaurant.body.dto';
import { RestaurantService } from '../restaurant.service';

@UseAuth(UserRoleType.RESTAURANT_OWNER)
@Controller('management/restaurant')
export class RestaurantManagementController {
  constructor(
    private readonly restaurantService:RestaurantService,
    private readonly categoryService:CategoryService,
  ) {}

  @Patch('/:restaurantId')
  public async updateRestaurant(@Param('restaurantId') restaurantId:number, @Body() data: UpdateRestaurantBodyDto):Promise<void> {
    return this.restaurantService.updateRestaurant(restaurantId, data);
  }

  @Get(':restaurantId/category')
  public async getRestaurantCategories(@Param('restaurantId') restaurantId:number):Promise<Category[]> {
    return this.categoryService.getCategories(restaurantId);
  }
}
