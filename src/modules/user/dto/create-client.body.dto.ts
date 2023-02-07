import { IsNotEmpty, IsString } from "class-validator"

export class CreateClientBodyDto{
    @IsString()
    @IsNotEmpty()
    name!:string

    @IsString()
    @IsNotEmpty()
    phone!:string
}