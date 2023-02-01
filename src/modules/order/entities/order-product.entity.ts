import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { ProductEntity } from '@/modules/product/entitites/product.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { OrderProduct } from '../interfaces/order-product.entity';
import { OrderEntity } from './order.entity';

@Entity(TableName.ORDER_PRODUCT)
export class OrderProductEntity extends BaseEntity implements OrderProduct {
  @Column('int')
  orderId!: number;

  @Column('int')
  productId!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  price!: number;

  @Column('int')
  quantity!: number;

  @ManyToOne(() => OrderEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'orderId' })
  order?: OrderEntity;

  @ManyToOne(() => ProductEntity, {
    onDelete: 'NO ACTION',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product?: ProductEntity;
}
