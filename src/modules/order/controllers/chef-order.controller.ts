import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';

import { ChangeStatusBodyDTO } from '../dto/change-status.body.dto';
import type { ChefOrderStatus } from '../enum/order-status.enum';
import type { Order } from '../interfaces/order.interface';
import { OrderService } from '../services/order.service';

@Controller('chef/restaurant/:restaurantId/order')
export class ChefOrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('')
  public async getOrders(
    @Param('restaurantId') restaurantId: number,
      @Query('status') status?: ChefOrderStatus,
  ): Promise<Order[]> {
    return this.orderService.getChefOrders(restaurantId, status);
  }

  @Patch(':orderId')
  public async changeStatus(@Body() { status }:ChangeStatusBodyDTO, @Param('orderId') orderId:number):Promise<void> {
    return this.orderService.chefChangeStatus(status, orderId);
  }
}
