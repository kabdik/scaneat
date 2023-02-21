import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderTrackEntity } from '../order/entities/order-track.entity';
import { OrderModule } from '../order/order.module';
import { TgChatEntity } from './entities/tg-chat.entity';
import { TelegramService } from './telegram.service';
import { TelegramUpdate } from './telegram.update';

@Module({
  imports: [OrderModule, TypeOrmModule.forFeature([TgChatEntity, OrderTrackEntity])],
  providers: [TelegramUpdate, TelegramService],

})
export class TelegramModule {

}
