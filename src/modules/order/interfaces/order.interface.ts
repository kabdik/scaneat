import type { BaseEntity } from '@/common/entities/base.entity';

import type { OrderStatus } from '../enum/order-status.enum';
import type { OrderType } from '../enum/order-type.enum';

export interface Order extends BaseEntity {
  userId: number;
  restaurantId: number;
  profit:number;
  total:number;
  description:string | null;
  status:OrderStatus;
  type:OrderType;
}
