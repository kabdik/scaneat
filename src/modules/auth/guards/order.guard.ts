import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { Request } from 'express';
import type { EntityManager } from 'typeorm';

import { OrderEntity } from '@/modules/order/entities/order.entity';

@Injectable()
export class OrderGuard implements CanActivate {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const restaurantId = Number(req.params['restaurantId']);
    const orderId = Number(req.params['orderId']);

    if (!orderId) {
      return true;
    }
    const order = await this.em.findOneBy(OrderEntity, { id: orderId, restaurantId });
    return !!order;
  }
}
