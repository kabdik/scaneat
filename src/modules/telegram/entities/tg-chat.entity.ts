import { BaseEntity, Entity, PrimaryColumn } from "typeorm";
import type { TgChat } from "../interfaces/tg-chat.interface";

@Entity()
export class TgChatEntity extends BaseEntity implements TgChat{
    @PrimaryColumn()
    tgChatId!:number
}