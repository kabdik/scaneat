import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { Request } from 'express';
import { EntityManager } from 'typeorm';

import { RestaurantOwnerEntity } from '@/modules/restaurant-owner/entities/restaurant-owner.entity';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';

import type { UserPayload } from '../auth.interface';

@Injectable()
export class RestaurantGuard implements CanActivate {
  constructor(
    @InjectEntityManager() private em: EntityManager,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req:Request = context.switchToHttp().getRequest();
    const restaurantId = Number(req.params['restaurantId']);

    if (!restaurantId) {
      return false;
    }

    const user = <UserPayload>req.user;
    if (user.role !== UserRoleType.RESTAURANT_OWNER) {
      return false;
    }

    const restaurantOwner = await this.em.findOneBy(RestaurantOwnerEntity, {
      userId: user.userId,
      restaurantId,
    });
    return !(!restaurantOwner);
  }
}
