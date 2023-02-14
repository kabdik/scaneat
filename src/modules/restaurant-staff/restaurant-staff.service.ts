import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { RestaurantEntity } from '../restaurant/entities/restaurant.entity';
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
      const restaurant = await em.findOneBy(RestaurantEntity, { id: restaurantId });
      if (!restaurant) {
        throw new BadRequestException('Такого ресторана не существует');
      }
      const user = await this.userService.createUser(data, em);

      const { id: restaurantStaffId } = await em.save(RestaurantStaffEntity, { userId: user.id });
      await em.save(StaffRoleEntity, { restaurantStaffId, restaurantId, role: data.role });
    });
  }
}
