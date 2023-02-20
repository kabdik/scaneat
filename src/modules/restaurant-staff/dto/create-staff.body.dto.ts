import type { UserRoleType } from '@/modules/user/enums/user-role.enum';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsString()
  @IsNotEmpty()
  role!: UserRoleType;
}
