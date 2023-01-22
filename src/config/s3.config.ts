import { get } from 'env-var';

export class S3Config {
  public static readonly AWS_S3_ACCESS_KEY: string = get('AWS_S3_ACCESS_KEY').required().asString();
  public static readonly AWS_S3_SECRET_KEY: string = get('AWS_S3_SECRET_KEY').required().asString();
  public static readonly AWS_S3_BUCKET_NAME: string = get('AWS_S3_BUCKET_NAME').required().asString();
}
