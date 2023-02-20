import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import { RestaurantEntity } from '../restaurant/entities/restaurant.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import type { ChangeStaffBodyDto } from './dto/change-staff.body.dto';
import type { CreateStaffBodyDto } from './dto/create-staff.body.dto';
import { RestaurantStaffEntity } from './entitites/restaurant-staff.entity';
import { StaffRoleEntity } from './entitites/staff-role.entity';
import { RestaurantStaffRole } from './enums/restaurant-staff-role.enum';
import type { RestaurantStaff } from './interfaces/restaurant-staff.interface';
import type { GetStaff } from './interfaces/staff-role.interface';

@Injectable()
export class RestaurantStaffService {
  constructor(
    @InjectRepository(RestaurantStaffEntity)
    private readonly restaurantStaffRepository: Repository<RestaurantStaffEntity>,
    @InjectRepository(StaffRoleEntity)
    private readonly staffRoleRepository: Repository<StaffRoleEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userService: UserService,
  ) {}

  public async getAll(restaurantId: number, role?: RestaurantStaffRole): Promise<GetStaff[]> {
    let query = `
      SELECT u.id,u.name,u.surname, u.email, u.phone, u.role,
        sr."restaurantStaffId"
        FROM public.${TableName.USER} as u 
        INNER JOIN ${TableName.RESTAURANT_STAFF} as rs
        ON u.id=rs."userId"
        INNER JOIN ${TableName.STAFF_ROLE} as sr
        ON rs.id= sr."restaurantStaffId" 
    `;
    let whereClause = 'WHERE sr."restaurantId"=$1 ';
    const params: Array<number | RestaurantStaffRole> = [restaurantId];
    if (role) {
      if (!Object.values(RestaurantStaffRole).includes(role)) {
        throw new BadRequestException('Неправильное значение роли');
      }

      whereClause += 'AND sr.role=$2';
      params.push(role);
    }

    query += whereClause;
    return <Promise<GetStaff[]>> this.staffRoleRepository.manager.query(query, params);
  }

  public async createStaff({ photoId, ...data }: CreateStaffBodyDto, restaurantId: number): Promise<void> {
    return this.restaurantStaffRepository.manager.transaction(async (em: EntityManager) => {
      const restaurant = await em.findOneBy(RestaurantEntity, { id: restaurantId });
      if (!restaurant) {
        throw new BadRequestException('Такого ресторана не существует');
      }
      const user = await this.userService.createUser(data, em);

      const { id: restaurantStaffId } = await em.save(RestaurantStaffEntity, { userId: user.id, photoId });
      await em.save(StaffRoleEntity, { restaurantStaffId, restaurantId, role: data.role });
    });
  }

  public async delete(staffId: number, restaurantId: number): Promise<void> {
    const staff = await this.staffRoleRepository.findOne({ where: { restaurantId, restaurantStaffId: staffId } });
    if (!staff) {
      throw new NotFoundException('Работника с таким айди у этого ресторана не существует');
    }
    await this.staffRoleRepository.remove(staff);
  }

  public async change(staffId: number, restaurantId: number, { photoId, ...userData }: ChangeStaffBodyDto): Promise<void> {
    const staff = await this.staffRoleRepository.findOne({ where: { restaurantId, restaurantStaffId: staffId } });
    if (!staff) {
      throw new NotFoundException('Работника с таким айди у этого ресторана не существует');
    }
    const { userId } = <Pick<RestaurantStaff, 'userId'>> await this.restaurantStaffRepository.findOne({
      where: { id: staffId },
      select: ['userId'],
    });
    await this.restaurantStaffRepository.update(staffId, { photoId });
    await this.userRepository.update(userId, userData);
  }
}
