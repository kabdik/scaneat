import type { BaseEntity } from '@/common/entities/base.entity';

export interface Restaurant extends BaseEntity {
  name:string;
  slug:string;
  phone:string;
  cityId:number;
  hasTakeAway:boolean;
  hasDelivery: boolean;
  isActive: boolean;
  rating:number;
  address:string;
}
