import type { BaseEntity } from '@/common/entities/base.entity';
import type { ProductEntity } from '@/modules/product/entitites/product.entity';

export interface Category extends BaseEntity {
  name:string;
  restaurantId:number;
  description:string;
  isActive:boolean;
}

export interface CategoryWithProduct extends Category {
  products:ProductEntity[];
}
