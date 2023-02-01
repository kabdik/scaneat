import type { BaseEntity } from '@/common/entities/base.entity';

export interface OrderAddress extends BaseEntity {
  cityId:number;
  orderId:number;
  address:string;
  details:string;
}
