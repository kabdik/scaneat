import { Body, Controller, Param, Patch } from '@nestjs/common';

import { UseAuth } from '@/common/decorators/auth.decorator';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';

import { UpdateRestaurantBodyDto } from '../dto/update-restaurant.body.dto';
import { RestaurantService } from '../restaurant.service';

@UseAuth(UserRoleType.RESTAURANT_OWNER)
@Controller('management/restaurant')
export class RestaurantManagementController {
  constructor(private readonly restaurantService:RestaurantService) {}

  @Patch('/:restaurantId')
  public async updateRestaurant(@Param('restaurantId') restaurantId:number, @Body() data: UpdateRestaurantBodyDto):Promise<void> {
    return this.restaurantService.updateRestaurant(restaurantId, data);
  }
}
