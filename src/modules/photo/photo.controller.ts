import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import type { Photo } from './interfaces/photo.interface';
import { PhotoService } from './photo.service';

@Controller('photo')
export class PhotoController {
  constructor(private readonly photoService:PhotoService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  public async imageUpload(@UploadedFile() image: Express.Multer.File): Promise<Photo> {
    return this.photoService.imageUpload(image.buffer);
  }
}
