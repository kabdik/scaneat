import type { BaseEntity } from '@/common/entities/base.entity';

import type { PRODUCT_PICTURE_THUMBNAILS } from '../photo.constant';

export type ProductPictureSizeAll = typeof PRODUCT_PICTURE_THUMBNAILS;
export type ProductPictureSize = ProductPictureSizeAll[number];
export type ProductPictureThumbnails = Record<ProductPictureSize, string>;

export interface Photo extends BaseEntity {
  originalUrl: string;
  thumbnails: ProductPictureThumbnails;
}
