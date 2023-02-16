import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { CreateOrderBodyDto } from '../dto/create-order.body.dto';
import { OrderService } from '../services/order.service';

@Controller('restaurant/:restaurantId/order')
export class OrderController {
  constructor(private readonly orderService:OrderService) {}

  @ApiOperation({ summary: 'Creating order for client' })
  @Post('')
  public async createOrder(
    @Body() data:CreateOrderBodyDto,
      @Param('restaurantId') restaurantId:number,
  ):Promise<string> {
    return this.orderService.createOrder(data, restaurantId);
  }
}
