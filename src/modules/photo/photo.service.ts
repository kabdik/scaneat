import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { ThumbnailService } from '@/common/providers/thumbnail.service';

import { PhotoEntity } from './entities/photo.entity';
import type { Photo } from './interfaces/photo.interface';
import { PRODUCT_PICTURE_THUMBNAILS } from './photo.constant';

@Injectable()
export class PhotoService {
  private readonly S3_ATTACHMENT_DIR: string = 'products';
  constructor(
    @InjectRepository(PhotoEntity)
    private readonly photoRepository:Repository<PhotoEntity>,
    private readonly thumbnailService: ThumbnailService,
  ) {}

  public async imageUpload(image:Buffer): Promise<Photo> {
    const imageWithThumbnails = await this.thumbnailService.saveImageThumbnails(image, {
      dir: this.S3_ATTACHMENT_DIR,
      thumbnailSizes: PRODUCT_PICTURE_THUMBNAILS });

    return this.photoRepository.save({
      originalUrl: imageWithThumbnails.original,
      thumbnails: imageWithThumbnails.thumbnails });
  }
}
