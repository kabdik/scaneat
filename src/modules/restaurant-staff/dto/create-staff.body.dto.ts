import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
export class CreateStaffBodyDto {
  @IsNumber()
  @IsOptional()
  photoId?: number;
  
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  surname!: string;

  @IsString()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsBoolean()
  @IsNotEmpty()
  isManager!:boolean

  @IsBoolean()
  @IsNotEmpty()
  isChef!:boolean
}
