import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { UserRoleType } from '../user/enums/user-role.enum';
import { UserService } from '../user/user.service';
import type { CreateRestaurantOwnerBodyDto } from './dto/create-restaurant-owner.body.dto';
import { RestaurantOwnerEntity } from './entities/restaurant-owner.entity';

@Injectable()
export class RestaurantOwnerService {
  constructor(
    @InjectRepository(RestaurantOwnerEntity)
    private readonly restaurantOwnerRepository: Repository<RestaurantOwnerEntity>,
    private readonly userService:UserService,
  ) {}

  public async createRestaurantOwner({ restaurantId, ...data }:CreateRestaurantOwnerBodyDto, em?:EntityManager):Promise<void> {
    const entityManager = em || this.restaurantOwnerRepository.manager;

    let user = await this.userService.getUserByEmail(data.email);
    if (!user) {
      user = await this.userService.createUser({ ...data, role: UserRoleType.RESTAURANT_OWNER }, entityManager);
    }

    await entityManager.save(RestaurantOwnerEntity, { userId: user.id, restaurantId });
  }
}
