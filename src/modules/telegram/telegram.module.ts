import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TgChatEntity } from './entities/tg-chat.entity';
import { TelegramChatService } from './services/telegram-chat.service';
import { TelegramService } from './services/telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([TgChatEntity])],
  providers: [TelegramService, TelegramChatService],
  exports: [TelegramChatService],

})
export class TelegramModule {

}
