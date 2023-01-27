import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginBodyDto{
    @IsEmail()
    @IsNotEmpty()
    @Transform(({value}) => (<string>value).toLowerCase().trim())
    email!:string

    @IsString()
    @IsNotEmpty()
    password!:string
}