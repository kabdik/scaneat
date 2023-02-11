import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { RestaurantStaff } from '../interfaces/restaurant-staff.interface';

@Entity(TableName.RESTAURANT_STAFF)
export class RestaurantStaffEntity extends BaseEntity implements RestaurantStaff {
  @Column('int')
  userId!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
