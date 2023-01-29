import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddProductBodyDto{
    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    description!: string

    @IsNumber()
    @IsNotEmpty()
    price!: number

    @IsNumber()
    @IsNotEmpty()
    photoId!: number
}

export class AddProductWithCategoryDto extends AddProductBodyDto{
    @IsNumber()
    @IsNotEmpty()
    categoryId!: number

    @IsString()
    @IsNotEmpty()
    restaurantId!: number
}