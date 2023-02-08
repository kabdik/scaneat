import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { UserRoleType } from '../user/enums/user-role.enum';
import { UserService } from '../user/user.service';
import type { CreateStaffBodyDto } from './dto/create-staff.body.dto';
import { RestaurantStaffEntity } from './entitites/restaurant-staff.entity';

@Injectable()
export class RestaurantStaffService {
  constructor(
    @InjectRepository(RestaurantStaffEntity) private readonly restaurantStaffRepository:Repository<RestaurantStaffEntity>,
    private readonly userService:UserService,
  ) {}

  public async createStaff({ role, ...data }:CreateStaffBodyDto, restaurantId:number):Promise<void> {
    return this.restaurantStaffRepository.manager.transaction(async (em:EntityManager) => {
      const user = await this.userService.createUser({ ...data, role: UserRoleType.RESTAURANT_STAFF }, em);

      await em.save(RestaurantStaffEntity, { userId: user.id, role, restaurantId });
    });
  }
}
