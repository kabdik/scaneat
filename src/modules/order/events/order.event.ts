import type { OrderStatus } from '../enum/order-status.enum';

export class OrderEvent {
  orderId:number
  status:OrderStatus
  constructor(orderId:number,status:OrderStatus){
    this.orderId=orderId
    this.status=status
  }
}
