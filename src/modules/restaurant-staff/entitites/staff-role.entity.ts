import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { RestaurantEntity } from '@/modules/restaurant/entities/restaurant.entity';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { StaffRole } from '../interfaces/staff-role.interface';
import { RestaurantStaffEntity } from './restaurant-staff.entity';

@Entity(TableName.STAFF_ROLE)
export class StaffRoleEntity extends BaseEntity implements StaffRole {
  @Column('int')
  restaurantStaffId!: number;

  @Column('enum', { enum: UserRoleType, nullable: true })
  role!: UserRoleType | null;

  @Column('int')
  restaurantId!: number;

  @ManyToOne(() => RestaurantStaffEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantStaffId' })
  restaurantStaff?: RestaurantStaffEntity;

  @ManyToOne(() => RestaurantEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: RestaurantEntity;
}
