import { IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateProductBodyDto{
    @IsString()
    @IsOptional()
    name?: string

    @IsString()
    @IsOptional()
    description?: string

    @IsNumber()
    @IsOptional()
    price?: number

    @IsNumber()
    @IsOptional()
    photoId?: number
}