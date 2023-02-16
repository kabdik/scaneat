import type { BaseEntity } from '@/common/entities/base.entity';
import type { OrderProduct } from '@/modules/product/interface/product.interface';
import type { OrderUser } from '@/modules/user/interfaces/user.interface';

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

export interface GetOrder extends Order {
  products:OrderProduct[];
  user: OrderUser;
  address:string;
  addressDetails:string;

}
