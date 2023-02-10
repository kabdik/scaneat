import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { RestaurantEntity } from '@/modules/restaurant/entities/restaurant.entity';
import { UserEntity } from '@/modules/user/entities/user.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { OrderStatus } from '../enum/order-status.enum';
import { OrderType } from '../enum/order-type.enum';
import type { Order } from '../interfaces/order.interface';

@Entity(TableName.ORDER)
export class OrderEntity extends BaseEntity implements Order {
  @Column('int')
  userId!: number;

  @Column('int')
  restaurantId!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  profit!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  total!: number;

  @Column('enum', { enum: OrderStatus, default: OrderStatus.IDLE })
  status!: OrderStatus;

  @Column('enum', { enum: OrderType })
  type!: OrderType;

  @Column('text', { nullable: true })
  description!: string | null;

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
