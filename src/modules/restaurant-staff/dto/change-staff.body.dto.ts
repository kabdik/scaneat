import {  IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';


export class ChangeStaffBodyDto {
  @IsNumber()
  @IsNotEmpty()
  photoId!: number;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  surname!: string;

  @IsString()
  @IsNotEmpty()
  phone!: string;

  @IsBoolean()
  @IsNotEmpty()
  isManager!:boolean

  @IsBoolean()
  @IsNotEmpty()
  isChef!:boolean
}
