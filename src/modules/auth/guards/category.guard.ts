import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import type { Request } from 'express';
import _ from 'lodash';
import type { EntityManager } from 'typeorm';

import { TableName } from '@/common/enums/table';
import type { Restaurant } from '@/modules/restaurant/interfaces/restaurant.interface';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';

import type { UserPayload } from '../auth.interface';

@Injectable()
export class RestaurantCategoryGuard implements CanActivate {
  constructor(
    @InjectEntityManager()
    private em:EntityManager,
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const req:Request = context.switchToHttp().getRequest();
    const restaurantId = Number(req.params['restaurantId']);
    const categoryId = Number(req.params['categoryId']);
    console.log(restaurantId);
    console.log(categoryId);

    const { userId, role } = <UserPayload>req.user;
    if (role !== UserRoleType.RESTAURANT_OWNER) {
      return true;
    }
    console.log(userId);
    console.log(role);

    if (!restaurantId) {
      return false;
    }
    const params:Array<string | number> = [restaurantId, userId];

    let query = `
        SELECT ro."restaurantId"
        FROM ${TableName.RESTAURANT_OWNER} AS ro    
    `;

    let whereClause = 'WHERE ro."restaurantId" = $1 AND ro."userId" = $2 ';

    if (categoryId) {
      params.push(categoryId);
      query += `
        INNER JOIN ${TableName.CATEGORY} as c
        ON ro."restaurantId" = c."restaurantId"
      `;
      whereClause += 'AND c.id = $3';
    }
    const result = <Pick<Restaurant, 'id'>[]> await this.em.query(query + whereClause, params);
    console.log(result);

    return !_.isEmpty(result);
  }
}
