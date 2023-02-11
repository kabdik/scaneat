import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { RestaurantEntity } from '@/modules/restaurant/entities/restaurant.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { UserRoleType } from '@/modules/user/enums/user-role.enum';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { StaffRole } from '../interfaces/staff-role.interface';

@Entity(TableName.STAFF_ROLE)
export class StaffRoleEntity extends BaseEntity implements StaffRole {
  @Column('int')
  userId!: number;

  @Column('enum', { enum: UserRoleType, nullable: true })
  role!: UserRoleType | null;

  @Column('int')
  restaurantId!: number;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @ManyToOne(() => RestaurantEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: RestaurantEntity;
}
