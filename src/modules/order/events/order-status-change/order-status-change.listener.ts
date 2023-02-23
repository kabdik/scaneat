import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import _ from 'lodash';
import { InjectBot } from 'nestjs-telegraf';
import type { Telegraf } from 'telegraf';
import type { Repository } from 'typeorm';

import { TelegramConfig } from '@/config/telegram.config';
import { EventType } from '@/modules/telegram/enums/event-type.enum';
import { TELEGRAM_STATUS_MESSAGES } from '@/modules/telegram/telegram.constants';

import { OrderTrackEntity } from '../../entities/order-track.entity';
import type { OrderStatusChangeEvent } from './order-status-change.event';

@Injectable()
export class OrderStatusChangeListener {
  constructor(
    @InjectRepository(OrderTrackEntity)
    private readonly orderTrackRepository:Repository<OrderTrackEntity>,
    @InjectBot(TelegramConfig.TELEGRAM_BOT_NAME) private readonly bot:Telegraf,
    @InjectSentry() private readonly client:SentryService,
  ) {}

  @OnEvent(EventType.ORDER_STATUS_CHANGE)
  public async handleOrderStatusChange(event:OrderStatusChangeEvent):Promise<void> {
    const chats = <Pick<OrderTrackEntity, 'tgChatId'>[]> await this.orderTrackRepository.find({ where: { orderId: event.orderId } });
    const tgChatIds = _.map(chats, 'tgChatId');
    const message = `Заказ #${event.orderId}\n${TELEGRAM_STATUS_MESSAGES[event.status]}`;

    try {
      tgChatIds?.forEach(async (tgChatId:number) => {
        await this.bot.telegram.sendMessage(tgChatId, message);
      });
    } catch (error) {
      this.client.instance().captureException(error);
    }
  }
}
