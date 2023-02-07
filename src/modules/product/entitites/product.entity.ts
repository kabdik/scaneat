import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { CategoryEntity } from '@/modules/category/entities/category.entity';
import { PhotoEntity } from '@/modules/photo/entities/photo.entity';
import { RestaurantEntity } from '@/modules/restaurant/entities/restaurant.entity';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import type { Product } from '../interface/product.interface';

@Entity(TableName.PRODUCT)
@Index(['name', 'restaurantId'], { unique: true })
export class ProductEntity extends BaseEntity implements Product {
  @Column('varchar', { nullable: false })
  name!: string;

  @Column('text')
  description!: string;

  @Column('numeric', { precision: 10, scale: 2 })
  unitPrice!: number;

  @Column('numeric', { precision: 10, scale: 2 })
  price!: number;

  @Column('int')
  restaurantId!: number;

  @Column('int')
  categoryId!: number;

  @Column('int', { nullable: true })
  photoId!: number | null;

  @Column('boolean', { default: false })
  isDeleted!: boolean;

  @ManyToOne(() => RestaurantEntity, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'restaurantId' })
  restaurant?: RestaurantEntity;

  @ManyToOne(() => CategoryEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'categoryId' })
  category?: CategoryEntity;

  @ManyToOne(() => PhotoEntity, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'photoId' })
  photo?: PhotoEntity;
}
