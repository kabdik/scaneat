import { Body, Controller, Param, Post } from '@nestjs/common';

import { CreateOrderBodyDto } from './dto/create-order.body.dto';
import { OrderService } from './services/order.service';

@Controller('restaurant/:restaurantId/order')
export class OrderController {
  constructor(private readonly orderService:OrderService) {}

  @Post('')
  public async createOrder(
    @Body() data:CreateOrderBodyDto,
      @Param('restaurantId') restaurantId:number,
  ):Promise<void> {
    return this.orderService.createOrder(data, restaurantId);
  }
}
