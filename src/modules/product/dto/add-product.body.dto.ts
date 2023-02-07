import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class AddProductBodyDto{
    @IsNumber()
    @IsNotEmpty()
    categoryId!: number

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    description!: string

    @IsNumber()
    @IsNotEmpty()
    unitPrice!: number
    
    @IsNumber()
    @IsNotEmpty()
    price!: number

    @IsNumber()
    @IsNotEmpty()
    photoId!: number
}

export class AddProductWithCategoryDto extends AddProductBodyDto{


    @IsString()
    @IsNotEmpty()
    restaurantId!: number
}