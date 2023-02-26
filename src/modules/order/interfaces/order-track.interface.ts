import type { BaseEntity } from '@/common/entities/base.entity';

import type { OrderStatus } from '../enum/order-status.enum';

export interface OrderTrack extends BaseEntity {
  tgChatId:number;
  orderId:number;
}

export interface TgLink {
  tgLink:string;
  status:OrderStatus;
}
