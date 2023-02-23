import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TgChatEntity } from '../entities/tg-chat.entity';

@Injectable()
export class TelegramChatService {
  constructor(
    @InjectRepository(TgChatEntity)
    private readonly tgChatRepository:Repository<TgChatEntity>,
  ) {}

  public async create(tgChatId:number):Promise<void> {
    let tgChat = await this.tgChatRepository.findOneBy({ tgChatId });
    if (!tgChat) {
      tgChat = await this.tgChatRepository.save({ tgChatId });
    }
  }
}
