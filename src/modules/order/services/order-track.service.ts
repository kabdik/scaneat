import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { OrderTrackEntity } from '../entities/order-track.entity';

@Injectable()
export class OrderTrackService {
  constructor(
    @InjectRepository(OrderTrackEntity)
    private readonly orderTrackRepository: Repository<OrderTrackEntity>,
  ) {}

  public async findOrCreate(orderId:number, tgChatId:number):Promise<void> {
    const orderTrack = await this.orderTrackRepository.findOne({ where: { orderId, tgChatId } });
    if (!orderTrack) {
      await this.orderTrackRepository.save({ orderId, tgChatId });
    }
  }
}
