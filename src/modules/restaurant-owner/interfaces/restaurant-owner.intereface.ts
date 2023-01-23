import type { BaseEntity } from '@/common/entities/base.entity';

export interface RestaurantOwner extends BaseEntity {
  userId:number;
  restaurantId:number;
}
