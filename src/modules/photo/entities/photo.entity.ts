import { BaseEntity } from "@/common/entities/base.entity";
import { TableName } from "@/common/enums/table";
import { Column, Entity } from "typeorm";
import type { Photo, ProductPictureThumbnails } from "../interfaces/photo.interface";

@Entity(TableName.PHOTO)
export class PhotoEntity extends BaseEntity implements Photo{
    @Column('varchar')
    originalUrl!: string;

    @Column('jsonb')
    thumbnails!: ProductPictureThumbnails;

} 