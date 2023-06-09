import { Body, Controller, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';

import { UseAuth } from '@/common/decorators/auth.decorator';
import { ReqUser } from '@/common/decorators/req-user.decorator';
import { RestauranOwner } from '@/common/decorators/restoran-owner.decorator';
import type { OwnerPayload } from '@/modules/auth/auth.interface';

import type { CategoryWithProduct } from '../../category/interfaces/category.interface';
import { UserRoleType } from '../../user/enums/user-role.enum';
import { CreateRestaurantRequestBodyDto } from '../dto/create-restaurant-request.body.dto';
import { CreateRestaurantBodyDto } from '../dto/create-restaurant.body.dto';
import { UpdateRestaurantBodyDto } from '../dto/update-restaurant.body.dto';
import type { VerificationStatus } from '../enum/verification-status.enum';
import type { Restaurant, RestaurantWithOwner } from '../interfaces/restaurant.interface';
import { RestaurantService } from '../restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(
    private readonly restaurantService:RestaurantService,
  ) {}

  @ApiOperation({ summary: 'Get restaurant create requests for admin or system manager' })
  @UseAuth(UserRoleType.ADMIN, UserRoleType.SYSTEM_MANAGER)
  @Get('requests')
  public async getAllRestaurantRequests(@Query('status') status?:VerificationStatus):Promise<RestaurantWithOwner[]> {
    return this.restaurantService.getAllRestaurantRequests(status);
  }

  @ApiOperation({ summary: 'Get restaurant menu for everybody' })
  @Get(':restaurantSlug/menu')
  public async getMenu(@Param('restaurantSlug') restaurantSlug: string): Promise<CategoryWithProduct[]> {
    return this.restaurantService.getMenu(restaurantSlug);
  }

  @ApiOperation({ summary: 'Get one restaurant for the user, хз тебе нужно это или нет' })
  @Get(':restaurantSlug')
  public async getRestaurant(@Param('restaurantSlug') restaurantSlug: string): Promise<Restaurant> {
    return this.restaurantService.getRestaurantbySlug(restaurantSlug);
  }

  @ApiOperation({ summary: 'Get restaurant QRCode for owner' })
  @RestauranOwner()
  @Get(':restaurantId/qr')
  public async generateQR(@Param('restaurantId') restaurantId:number, @Res() res:Response): Promise<void> {
    const qrCode = await this.restaurantService.generateQR(restaurantId);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'attachment; filename=qr-code.png');
    res.send(qrCode);
  }

  @ApiOperation({ summary: 'Create restaurant by request' })
  @Post('')
  public async createRestaurantRequest(@Body() data: CreateRestaurantRequestBodyDto):Promise<void> {
    await this.restaurantService.createRestaurantRequest(data);
  }

  @Post('owner/request')
  @UseAuth(UserRoleType.RESTAURANT_OWNER)
  public async createAuthRestaurantRequest(@ReqUser() restaurantOwner:OwnerPayload, @Body() data:CreateRestaurantBodyDto): Promise<void> {
    await this.restaurantService.createRestaurant({ ...data, restaurantOwnerId: restaurantOwner.restaurantOwnerId });
  }

  @ApiOperation({ summary: 'Change restaurant details for owner' })
  @RestauranOwner()
  @Patch('/:restaurantId')
  public async updateRestaurant(@Param('restaurantId') restaurantId:number, @Body() data: UpdateRestaurantBodyDto):Promise<void> {
    return this.restaurantService.updateRestaurant(restaurantId, data);
  }

  @ApiOperation({ summary: 'Verify create restaurant request for admin or system manager' })
  @UseAuth(UserRoleType.ADMIN, UserRoleType.SYSTEM_MANAGER)
  @Patch('/:restaurantId/verify')
  public async verifyRestaurantRequest(@Param('restaurantId') restaurantId:number): Promise<void> {
    return this.restaurantService.verifyRestaurantRequest(restaurantId);
  }

  @ApiOperation({ summary: 'Reject create restaurant request for admin or system manager' })
  @UseAuth(UserRoleType.ADMIN, UserRoleType.SYSTEM_MANAGER)
  @Patch('/:restaurantId/reject')
  public async rejectRestaurantRequest(@Param('restaurantId') restaurantId:number): Promise<void> {
    return this.restaurantService.rejectRestaurantRequest(restaurantId);
  }

  @ApiOperation({ summary: 'Get all restaurants of owner' })
  @UseAuth(UserRoleType.RESTAURANT_OWNER)
  @Get('')
  public async getAll(@ReqUser() restaurantOwner:OwnerPayload, @Query('status') status?:VerificationStatus):Promise<Restaurant[]> {
    return this.restaurantService.getAll(restaurantOwner.restaurantOwnerId, status);
  }
}
