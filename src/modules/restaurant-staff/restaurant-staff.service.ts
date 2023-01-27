import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import type { UserPayload } from '../auth/auth.interface';
import { UserRoleType } from '../user/enums/user-role.enum';
import { UserService } from '../user/user.service';
import type { CreateStaffBodyDto } from './dto/create-staff.body.dto';
import { RestaurantStaffEntity } from './entitites/restaurant-staff.entity';
import type { RestaurantStaff } from './interfaces/restaurant-staff.interface';

@Injectable()
export class RestaurantStaffService {
  constructor(
    @InjectRepository(RestaurantStaffEntity) private readonly restaurantStaffRepository:Repository<RestaurantStaffEntity>,
    private readonly userService:UserService,
  ) {}

  public async createStaff({ role, ...data }:CreateStaffBodyDto, restaurantOwner:UserPayload):Promise<RestaurantStaff> {
    return this.restaurantStaffRepository.manager.transaction(async (em:EntityManager) => {
      const user = await this.userService.createUser({ ...data, role: UserRoleType.RESTAURANT_STAFF }, em);

      const [restaurantStaff] = <RestaurantStaff[]> await em.query(
        `
        WITH staff_insert AS(
              INSERT INTO ${TableName.RESTAURANT_STAFF} ("userId","role","restaurantId")
                  VALUES ($1,$2, (SELECT ro."restaurantId"
                                    FROM restaurant_owner AS ro
                                    WHERE ro."userId"=$3))
                  RETURNING *
        )
        SELECT * 
          FROM staff_insert 
        `,
        [user.id, role, restaurantOwner.userId],
      );

      return restaurantStaff;
    });
  }
}
