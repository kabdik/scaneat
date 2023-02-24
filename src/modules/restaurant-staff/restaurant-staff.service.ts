import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { EntityManager, Not, Repository } from 'typeorm';

import { TableName } from '@/common/enums/table';

import { RestaurantEntity } from '../restaurant/entities/restaurant.entity';
import { UserEntity } from '../user/entities/user.entity';
import { UserRoleType } from '../user/enums/user-role.enum';
import { UserService } from '../user/user.service';
import type { CreateStaffBodyDto } from './dto/create-staff.body.dto';
import { RestaurantStaffEntity } from './entitites/restaurant-staff.entity';
import { StaffRoleEntity } from './entitites/staff-role.entity';
import { RestaurantStaffRole } from './enums/restaurant-staff-role.enum';
import type { ChangeStaffUser, RestaurantStaff } from './interfaces/restaurant-staff.interface';
import type { GetStaff, RoleData } from './interfaces/staff-role.interface';

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
        rs."photoId", p.thumbnails,
        sr."restaurantStaffId"
        FROM public.${TableName.USER} as u 
        INNER JOIN ${TableName.RESTAURANT_STAFF} as rs
        ON u.id=rs."userId"
        INNER JOIN ${TableName.STAFF_ROLE} as sr
        ON rs.id= sr."restaurantStaffId" 
        LEFT JOIN ${TableName.PHOTO} as p
        on rs."photoId"=p.id
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
      const user = await this.userService.createUser({ ...data, role: UserRoleType.RESTAURANT_STAFF }, em);

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

  public async update(staffId: number, restaurantId: number, roleData:RoleData, { photoId, ...userData }: ChangeStaffUser): Promise<void> {
    const staff = await this.staffRoleRepository.find({ where: { restaurantId, restaurantStaffId: staffId } });
    if (!staff) {
      throw new NotFoundException('Работника с таким айди у этого ресторана не существует');
    }
    if (!roleData.isChef && !roleData.isManager) {
      throw new BadRequestException('Either isChef or isManager must be true');
    }
    const { userId } = <Pick<RestaurantStaff, 'userId'>> await this.restaurantStaffRepository.findOne({
      where: { id: staffId },
      select: ['userId'],
    });

    const user = await this.userRepository.findOne({ where: { phone: userData.phone, id: Not(userId) } });
    if (user) {
      throw new BadRequestException('Пользователь с таким номером телефона уже существует');
    }
    await this.restaurantStaffRepository.update(staffId, { photoId });
    await this.userRepository.update(userId, userData);

    const staffRoles = <UserRoleType[]> _.map(staff, 'role');
    if (roleData.isChef && !staffRoles.includes(UserRoleType.CHEF)) {
      await this.staffRoleRepository.save({ restaurantStaffId: staffId, restaurantId, role: UserRoleType.CHEF });
    } else if (!roleData.isChef && staffRoles.includes(UserRoleType.CHEF)) {
      await this.staffRoleRepository.delete({ restaurantStaffId: staffId, role: UserRoleType.CHEF });
    }
    if (roleData.isManager && !staffRoles.includes(UserRoleType.MANAGER)) {
      await this.staffRoleRepository.save({ restaurantStaffId: staffId, restaurantId, role: UserRoleType.MANAGER });
    } else if (!roleData.isManager && staffRoles.includes(UserRoleType.MANAGER)) {
      await this.staffRoleRepository.delete({ restaurantStaffId: staffId, role: UserRoleType.MANAGER });
    }
  }
}
