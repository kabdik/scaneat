import { TableName } from "@/common/enums/table";
import { BaseEntity, Entity, PrimaryColumn } from "typeorm";
import type { TgChat } from "../interfaces/tg-chat.interface";

@Entity(TableName.TG_CHAT)
export class TgChatEntity extends BaseEntity implements TgChat{
    @PrimaryColumn()
    tgChatId!:number
}