import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { OrderTrackEntity } from '../order/entities/order-track.entity';
import { TgChatEntity } from './entities/tg-chat.entity';

@Injectable()
export class TelegramService {
  constructor(
    @InjectRepository(TgChatEntity)
    private readonly tgChatRepository: Repository<TgChatEntity>,
    @InjectRepository(OrderTrackEntity)
    private readonly orderTrackRepository: Repository<OrderTrackEntity>,
  ) {}

  public async create(orderId:number, tgChatId:number):Promise<void> {
    const tgChat = await this.tgChatRepository.findOneBy({ tgChatId });
    if (!tgChat) {
      await this.tgChatRepository.save({ tgChatId });
    }

    await this.orderTrackRepository.save({ orderId, tgChatId });
  }
}
