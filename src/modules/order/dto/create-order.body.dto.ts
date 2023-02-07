import { Type } from "class-transformer"
import { ArrayMinSize, IsArray, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf, ValidateNested } from "class-validator"
import { OrderType } from "../enum/order-type.enum"

export class OrderProductDto{
    @IsNumber()
    @IsNotEmpty()
    productId!:number

    @IsInt()
    @IsNotEmpty()
    quantity!:number
}


export class CreateOrderBodyDto {
    @IsArray()
    @ArrayMinSize(1)
    @Type(()=>OrderProductDto)
    @ValidateNested({each:true})
    products!: OrderProductDto[]

    @IsNotEmpty()
    @IsEnum(OrderType)
    type!: OrderType

    @IsString()
    @IsOptional()
    description?: string

    @IsString()
    @IsNotEmpty()
    name!: string

    @IsString()
    @IsNotEmpty()
    phone!:string

    @ValidateIf(o => o.type==OrderType.DELIVERY)
    @IsString()
    @IsNotEmpty()
    address!:string

    @ValidateIf(o => o.type==OrderType.DELIVERY)
    @IsString()
    @IsNotEmpty()
    details!:string

    @IsNumber()
    @IsNotEmpty()
    total!:number

}