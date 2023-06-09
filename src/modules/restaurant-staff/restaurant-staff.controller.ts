import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';

import { RestauranOwner } from '@/common/decorators/restoran-owner.decorator';

import { ChangeStaffBodyDto } from './dto/change-staff.body.dto';
import { CreateStaffBodyDto } from './dto/create-staff.body.dto';
import type { RestaurantStaffRole } from './enums/restaurant-staff-role.enum';
import type { GetStaff } from './interfaces/staff-role.interface';
import { RestaurantStaffService } from './restaurant-staff.service';

@RestauranOwner()
@Controller('restaurant/:restaurantId/staff')
export class RestaurantStaffController {
  constructor(private restaurantStaffService: RestaurantStaffService) {}

  @Get()
  public async getAll(
    @Param('restaurantId') restaurantId:number,
      @Query('role') role?:RestaurantStaffRole,
  ):Promise<GetStaff[]> {
    return this.restaurantStaffService.getAll(restaurantId, role);
  }

  @Post('')
  public async createStaff(
    @Body() { isChef, isManager, ...data }: CreateStaffBodyDto,
      @Param('restaurantId') restaurantId: number,
  ): Promise<void> {
    return this.restaurantStaffService.createStaff(restaurantId, { isChef, isManager }, data);
  }

  @Delete(':staffId')
  public async delete(
    @Param('staffId') staffId:number,
      @Param('restaurantId') restaurantId:number,
  ):Promise<void> {
    return this.restaurantStaffService.delete(staffId, restaurantId);
  }

  @Put(':staffId')
  public async update(
    @Param('staffId') staffId:number,
      @Param('restaurantId') restaurantId:number,
      @Body() { isChef, isManager, ...data }:ChangeStaffBodyDto,
  ):Promise<void> {
    return this.restaurantStaffService.update(staffId, restaurantId, { isChef, isManager }, data);
  }
}
