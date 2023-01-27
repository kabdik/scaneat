import { Global, Module } from '@nestjs/common';

import { Logger } from './logger';
import { RequestContext } from './logger/request-context';
import { S3Service } from './providers/s3.service';
import { SendgridService } from './providers/sendgrid.service';
import { ThumbnailService } from './providers/thumbnail.service';
import { UtilService } from './providers/util.service';

const services = [Logger, RequestContext, S3Service, ThumbnailService, UtilService, SendgridService];

@Global()
@Module({
  providers: services,
  exports: services,
})
export class CommonModule {}
