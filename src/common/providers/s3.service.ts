import { Injectable } from '@nestjs/common';
import { SentryService } from '@ntegral/nestjs-sentry';
import S3 from 'aws-sdk/clients/s3';

import { S3Config } from '@/config/s3.config';

@Injectable()
export class S3Service {
  private s3: S3;
  private bucket: string;
  constructor(private readonly sentry: SentryService) {
    this.s3 = new S3({
      credentials: {
        accessKeyId: S3Config.AWS_S3_ACCESS_KEY,
        secretAccessKey: S3Config.AWS_S3_SECRET_KEY,
      },
      maxRetries: 3,
    });
    this.bucket = S3Config.AWS_S3_BUCKET_NAME;
  }

  public async uploadFile(key: string, file: Buffer): Promise<string> {
    const Key = key.charAt(0) === '/' ? key.substring(1) : key;

    const params = {
      Body: file,
      Bucket: this.bucket,
      Key,
    };

    await this.s3
      .putObject(params)
      .promise()
      .catch((err: unknown) => {
        this.sentry.instance().captureException(`Error uploading to S3 at path ${key}:  ${err}`);
        throw err;
      });

    return Key;
  }
}
