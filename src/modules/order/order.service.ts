import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import type { CreateOrderBodyDto } from './dto/create-order.body.dto';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  constructor(@InjectRepository(OrderEntity)
  private readonly orderRepository:Repository<OrderEntity>) {}

  public async createOrder(data:CreateOrderBodyDto):Promise<void> {
    console.log(data);
    const orders = await this.orderRepository.find();
    console.log(orders);
  }
}
