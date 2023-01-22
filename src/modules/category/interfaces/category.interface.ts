import type { BaseEntity } from '@/common/entities/base.entity';

export interface Category extends BaseEntity {
  name:string;
  restaurantId:number;
  desctiption:string;
  isActive:boolean;
}
