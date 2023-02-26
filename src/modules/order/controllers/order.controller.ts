import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CreateOrderBodyDto } from '../dto/create-order.body.dto';
import type { TgLink } from '../interfaces/order-track.interface';
import type { OrderCode } from '../interfaces/order.interface';
import { OrderService } from '../services/order.service';

@Controller('restaurant/:restaurantId/order')
export class OrderController {
  constructor(private readonly orderService:OrderService) {}

  @ApiOperation({ summary: 'Creating order for client' })
  @Post('')
  public async createOrder(
    @Body() data:CreateOrderBodyDto,
      @Param('restaurantId') restaurantId:number,
  ):Promise<OrderCode> {
    return this.orderService.createOrder(data, restaurantId);
  }

  @Get(':code')
  public async getOne(@Param('code') code:string):Promise<TgLink> {
    return this.orderService.getOne(code);
  }
}
