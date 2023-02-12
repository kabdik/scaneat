import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { ChangeStatusBodyDTO } from '../dto/change-status.body.dto';
import type { Order } from '../interfaces/order.interface';
import { OrderService } from '../services/order.service';

@Controller('manager/restaurant/:restaurantId/order')
export class ManagerOrderController {
  constructor(private readonly orderService:OrderService) {}

  @Get('')
  public async getOrders(@Param('restaurantId') restaurantId:number, @Query('status') status?:string):Promise<Order[]> {
    return this.orderService.getManagerOrders(restaurantId, status);
  }

  @Patch(':orderId/accept')
  public async acceptOrder(@Param('orderId') orderId:number):Promise<void> {
    return this.orderService.acceptOrder(orderId);
  }

  @Patch(':orderId')
  public async changeStatus(@Body() { status }:ChangeStatusBodyDTO, @Param('orderId') orderId:number):Promise<void> {
    return this.orderService.changeStatus(status, orderId);
  }
}
