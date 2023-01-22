import { BaseEntity } from '@/common/entities/base.entity';
import { TableName } from '@/common/enums/table';
import { CategoryEntity } from '@/modules/category/entities/category.entity';
import { RestaurantEntity } from '@/modules/restaurant/entities/restaurant.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { Product } from '../interface/product.interface';

@Entity(TableName.PRODUCT)
export class ProductEntity extends BaseEntity implements Product{
    @Column('varchar', { nullable: false })
    name!: string;
    
    @Column('text')
    description!: string;

    @Column('numeric', { precision: 10, scale: 2, nullable: false })
    price!: number;

    @Column('int', { nullable: false })
    restaurantId!: number;

    @Column('int')
    categoryId!: number

    @ManyToOne(() => RestaurantEntity,{
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({ name: 'restaurantId' })
    restaurant?: RestaurantEntity

    @ManyToOne(() => CategoryEntity, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE'
    })
    @JoinColumn({name: 'categoryId' })
    category?: CategoryEntity
}