import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { Request } from 'express';
import type { EntityManager } from 'typeorm';

import { StaffRoleEntity } from '@/modules/restaurant-staff/entitites/staff-role.entity';

import type { RestaurantStaffPayload } from '../auth.interface';

@Injectable()
export class RestaurantStaffGuard implements CanActivate {
  constructor(
    @InjectEntityManager()
    private em: EntityManager,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const restaurantId = Number(req.params['restaurantId']);

    const { restaurantStaffId } = <RestaurantStaffPayload>req.user;
    const staffRole = await this.em.findOneBy(StaffRoleEntity, { restaurantId, restaurantStaffId });
    return !!staffRole;
  }
}
