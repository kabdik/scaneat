import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { ChangeStatusBodyDTO } from '../dto/change-status.body.dto';
import type { OrderStatus } from '../enum/order-status.enum';
import type { Order } from '../interfaces/order.interface';
import { OrderService } from '../services/order.service';

@Controller('manager/restaurant/:restaurantId/order')
export class ManagerOrderController {
  constructor(private readonly orderService:OrderService) {}

  @ApiOperation({ summary: 'getting orders for manager with "status" query param' })
  @Get('')
  public async getOrders(@Param('restaurantId') restaurantId:number, @Query('status') status?:OrderStatus):Promise<Order[]> {
    return this.orderService.getManagerOrders(restaurantId, status);
  }

  @ApiOperation({ summary: 'accepting order for manager ' })
  @Patch(':orderId/accept')
  public async acceptOrder(@Param('orderId') orderId:number):Promise<void> {
    return this.orderService.acceptOrder(orderId);
  }

  @ApiOperation({ summary: 'changing order status for manager ' })
  @Patch(':orderId')
  public async changeStatus(@Body() { status }:ChangeStatusBodyDTO, @Param('orderId') orderId:number):Promise<void> {
    return this.orderService.changeStatus(status, orderId);
  }

  @ApiOperation({ summary: 'rejecting order for manager ' })
  @Patch(':orderId/reject')
  public async rejectOrder(@Param('orderId') orderId:number):Promise<void> {
    return this.orderService.rejectOrder(orderId);
  }
}
