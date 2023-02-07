import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { DataSource } from 'typeorm';

import { RestaurantOwnerEntity } from '@/modules/restaurant-owner/entities/restaurant-owner.entity';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';

@Injectable()
export class RestaurantGuard implements CanActivate {
  constructor(
    @Inject(DataSource) private readonly dataSource: DataSource,
  ) {
  }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req:Request = context.switchToHttp().getRequest();
    const restaurantId = Number(req.params['restaurantId']);
    const { user } = req;
    if (user?.role !== UserRoleType.RESTAURANT_OWNER) {
      return true;
    }

    const restaurantOwner = await this.dataSource.getRepository(RestaurantOwnerEntity).findOne({ where: {
      userId: user?.userId,
      restaurantId,
    } });
    return !(!restaurantOwner);
  }
}
