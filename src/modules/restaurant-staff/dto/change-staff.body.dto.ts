import {  IsNumber, IsOptional, IsString } from 'class-validator';
export class ChangeStaffBodyDto {
  @IsNumber()
  @IsOptional()
  photoId?: number;

  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  surname?: string;

  @IsString()
  @IsOptional()
  phone?: string;

}
