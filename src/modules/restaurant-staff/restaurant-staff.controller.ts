import { Body, Controller, Param, Post } from '@nestjs/common';

import { RestauranOwner } from '@/common/decorators/restoran-owner.decorator';

import { CreateStaffBodyDto } from './dto/create-staff.body.dto';
import { RestaurantStaffService } from './restaurant-staff.service';

@RestauranOwner()
@Controller('restaurant/:restaurantId/staff')
export class RestaurantStaffController {
  constructor(private restaurantStaffService: RestaurantStaffService) {}

  @Post('')
  public async createStaff(
    @Body() data: CreateStaffBodyDto,
      @Param('restaurantId') restaurantId: number,
  ): Promise<void> {
    return this.restaurantStaffService.createStaff(data, restaurantId);
  }
}
