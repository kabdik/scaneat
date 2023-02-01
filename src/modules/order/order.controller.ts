import { Body, Controller, Post } from '@nestjs/common';

import { CreateOrderBodyDto } from './dto/create-order.body.dto';
import { OrderService } from './order.service';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService:OrderService) {}

  @Post('')
  public async createOrder(@Body() data:CreateOrderBodyDto):Promise<void> {
    return this.orderService.createOrder(data);
  }
}
