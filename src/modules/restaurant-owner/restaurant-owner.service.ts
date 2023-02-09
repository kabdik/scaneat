import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { EntityManager, Repository } from 'typeorm';

import { UserEntity } from '../user/entities/user.entity';
import { UserRoleType } from '../user/enums/user-role.enum';
import { UserService } from '../user/user.service';
import type { CreateRestaurantOwnerRequestBodyDto } from './dto/create-restaurant-owner.body.dto';
import { RestaurantOwnerEntity } from './entities/restaurant-owner.entity';
import type { RestaurantOwner } from './interfaces/restaurant-owner.intereface';

@Injectable()
export class RestaurantOwnerService {
  constructor(
    @InjectRepository(RestaurantOwnerEntity)
    private readonly restaurantOwnerRepository: Repository<RestaurantOwnerEntity>,
    private readonly userService: UserService,
  ) {}

  public async createRestaurantOwner(data : CreateRestaurantOwnerRequestBodyDto, em?: EntityManager): Promise<RestaurantOwner> {
    const entityManager = em || this.restaurantOwnerRepository.manager;
    let user = await entityManager.findOneBy(UserEntity, [{ email: data.email }, { phone: data.phone }]);

    if (user) {
      if (user.email === data.email) {
        throw new BadRequestException('Данный пользователь уже существует');
      } else if (user.phone === data.phone) {
        throw new BadRequestException('Этот номер телефона уже зарегестрирован');
      }
    }
    user = await this.userService.createUser({ ...data, role: UserRoleType.RESTAURANT_OWNER }, entityManager);
    return entityManager.save(RestaurantOwnerEntity, { userId: user.id });
  }
}
