import type { BaseEntity } from '@/common/entities/base.entity';

export interface OrderAddress extends BaseEntity {
  cityId:number;
  orderId:number;
  address:string;
  details:string;
}

export interface AddressWithDetails {
  address:string;
  details:string;
  cityId:number;
}
