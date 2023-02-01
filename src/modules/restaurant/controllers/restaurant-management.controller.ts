import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { UseAuth } from '@/common/decorators/auth.decorator';
import { ReqUser } from '@/common/decorators/req-user.decorator';
import type { UserPayload } from '@/modules/auth/auth.interface';
import { CategoryService } from '@/modules/category/category.service';
import type { Category } from '@/modules/category/interfaces/category.interface';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';

import { UpdateRestaurantBodyDto } from '../dto/update-restaurant.body.dto';
import type { VerificationStatus } from '../enum/verification-status.enum';
import type { Restaurant } from '../interfaces/restaurant.interface';
import { RestaurantService } from '../restaurant.service';

@Controller('management/restaurant')
export class RestaurantManagementController {
  constructor(
    private readonly restaurantService:RestaurantService,
    private readonly categoryService:CategoryService,
  ) {}

  @UseAuth(UserRoleType.RESTAURANT_OWNER)
  @Patch('/:restaurantId')
  public async updateRestaurant(@Param('restaurantId') restaurantId:number, @Body() data: UpdateRestaurantBodyDto):Promise<void> {
    return this.restaurantService.updateRestaurant(restaurantId, data);
  }

  @UseAuth(UserRoleType.RESTAURANT_OWNER)
  @Get(':restaurantId/category')
  public async getRestaurantCategories(@Param('restaurantId') restaurantId:number):Promise<Category[]> {
    return this.categoryService.getCategories(restaurantId);
  }

  @UseAuth(UserRoleType.ADMIN, UserRoleType.SYSTEM_MANAGER)
  @Patch('requests/:restaurantId/verify')
  public async verifyRestaurantRequest(@Param('restaurantId') restaurantId:number): Promise<void> {
    return this.restaurantService.verifyRestaurantRequest(restaurantId);
  }

  @UseAuth(UserRoleType.ADMIN, UserRoleType.SYSTEM_MANAGER)
  @Patch('requests/:restaurantId/reject')
  public async rejectRestaurantRequest(@Param('restaurantId') restaurantId:number): Promise<void> {
    return this.restaurantService.rejectRestaurantRequest(restaurantId);
  }

  @UseAuth(UserRoleType.RESTAURANT_OWNER)
  @Get('')
  public async getAll(@ReqUser() restaurantOwner:UserPayload, @Query('status') status:VerificationStatus):Promise<Restaurant[]> {
    return this.restaurantService.getAll(restaurantOwner.userId, status);
  }
}
