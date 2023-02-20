import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { PhotoEntity } from '@/modules/photo/entities/photo.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { RestaurantStaff } from '../interfaces/restaurant-staff.interface';

@Entity(TableName.RESTAURANT_STAFF)
export class RestaurantStaffEntity extends BaseEntity implements RestaurantStaff {
  @Column('int')
  userId!: number;

  @Column('int', { nullable: true })
  photoId!: number | null;

  @ManyToOne(() => PhotoEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'photoId' })
  photo?: PhotoEntity;

  @ManyToOne(() => UserEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;
}
