import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import type { Response } from 'express';

import { UseAuth } from '@/common/decorators/auth.decorator';

import type { CategoryWithProduct } from '../category/interfaces/category.interface';
import { UserRoleType } from '../user/enums/user-role.enum';
import { CreateRestaurantRequestBodyDto } from './dto/create-restaurant-request.body.dto';
import type { VerificationStatus } from './enum/verification-status.enum';
import type { Restaurant, RestaurantWithOwner } from './interfaces/restaurant.interface';
import { RestaurantService } from './restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurant:RestaurantService) {}

  @UseAuth(UserRoleType.ADMIN, UserRoleType.SYSTEM_MANAGER)
  @Get('requests')
  public async getAllRestaurantRequests(@Query('status') status:VerificationStatus):Promise<RestaurantWithOwner[]> {
    return this.restaurant.getAllRestaurantRequests(status);
  }

  @UseAuth(UserRoleType.ADMIN, UserRoleType.SYSTEM_MANAGER)
  @Patch('requests/:restaurantSlug/verify')
  public async verifyRestaurantRequest(@Param('restaurantSlug') restaurantSlug:string): Promise<void> {
    return this.restaurant.verifyRestaurantRequest(restaurantSlug);
  }

  @Get(':restaurantSlug/menu')
  public async getMenu(@Param('restaurantSlug') restaurantSlug: string): Promise<CategoryWithProduct[]> {
    return this.restaurant.getMenu(restaurantSlug);
  }

  @Get(':restaurantSlug')
  public async getRestaurant(@Param('restaurantSlug') restaurantSlug: string): Promise<Restaurant> {
    return this.restaurant.getRestaurantbySlug(restaurantSlug);
  }

  @Get(':restaurantSlug/qr')
  public async generateQR(@Param('restaurantSlug') restaurantSlug:string, @Res() res:Response): Promise<void> {
    const qrCode = await this.restaurant.generateQR(restaurantSlug);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename=qr-code.png');
    res.send(qrCode);
  }

  @Post('create')
  public async createRestaurantRequest(@Body() data: CreateRestaurantRequestBodyDto):Promise<void> {
    console.log(data.restaurant.photoId);
    await this.restaurant.createRestaurantRequest(data);
  }

  @Get('')
  public async getAll():Promise<Restaurant[]> {
    return this.restaurant.getAll();
  }
}
