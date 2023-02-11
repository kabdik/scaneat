import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UserService } from '../user/user.service';
import type { CreateStaffBodyDto } from './dto/create-staff.body.dto';
import { RestaurantStaffEntity } from './entitites/restaurant-staff.entity';
import { StaffRoleEntity } from './entitites/staff-role.entity';

@Injectable()
export class RestaurantStaffService {
  constructor(
    @InjectRepository(RestaurantStaffEntity) private readonly restaurantStaffRepository:Repository<RestaurantStaffEntity>,
    private readonly userService:UserService,
  ) {}

  public async createStaff(data:CreateStaffBodyDto, restaurantId:number):Promise<void> {
    return this.restaurantStaffRepository.manager.transaction(async (em:EntityManager) => {
      const user = await this.userService.createUser(data, em);

      await em.save(RestaurantStaffEntity, { userId: user.id });
      await em.save(StaffRoleEntity, { userId: user.id, restaurantId, role: data.role });
    });
  }
}
