import type { BaseEntity } from '@/common/entities/base.entity';

export interface Product extends BaseEntity {
  name:string;
  description:string;
  categoryId:number;
  restaurantId:number;
  price:number;
}
