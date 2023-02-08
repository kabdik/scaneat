import { IsNotEmpty, IsOptional, IsString } from "class-validator"
import type { UserRoleType } from "../enums/user-role.enum"

export class CreateUserBodyDto{
    @IsString()
    @IsNotEmpty()
    name!:string;

    @IsString()
    @IsNotEmpty()
    surname!: string;  
    
    @IsString()
    @IsNotEmpty()
    email!:string;

    @IsString()
    @IsOptional()
    phone?:string;

    @IsString()
    @IsOptional()
    password?:string | null;

    @IsString()
    @IsOptional()
    role!:UserRoleType | null;
} 