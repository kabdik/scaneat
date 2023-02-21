import type { OrderStatus } from '../enum/order-status.enum';

export class OrderEvent {
  orderId!: number;

  tgChatsId?: number[];

  status!: OrderStatus;
}
