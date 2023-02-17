import type { BaseEntity } from '@/common/entities/base.entity';

export interface OrderTrack extends BaseEntity {
  tgChatId:number;
  orderId:number;
}
