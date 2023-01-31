import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateRestaurantBodyDto {
  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  hasTakeAway?: boolean;

  @IsBoolean()
  @IsOptional()
  hasDelivery?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  photoId?: number;
}
