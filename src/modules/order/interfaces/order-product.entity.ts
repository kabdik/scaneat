import type { BaseEntity } from '@/common/entities/base.entity';

export interface OrderProduct extends BaseEntity {
  productId: number;
  orderId: number;
  unitPrice: number;
  price: number;
  quantity: number;
}
