import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { TypeProduct } from "../enum/product.enum"

export class CreateProductDto{
  @ApiProperty()
  titel:string
  @ApiProperty()
  content:string
  @ApiPropertyOptional()
  slug:string
  @ApiProperty({enum:TypeProduct,format:"enum"})
  type:string
  @ApiProperty()
  code:string
  @ApiProperty()
  image:string

  @ApiProperty()
  count:number
  @ApiPropertyOptional({format:'decimal'})
  price:number
  @ApiPropertyOptional({format:'decimal',default:0})
  discount:number
  @ApiPropertyOptional({default:false})
  active_discount:boolean
}

export class UpdateProductDto extends PartialType(CreateProductDto){}



//! Color
export class CreateColorDto{}

export class UpdateColorDto extends PartialType(CreateColorDto){}


//! Size
export class CreateSizeDto{}

export class UpdateSizeDto extends PartialType(CreateSizeDto){}


//! Ditels
export class CreateDitelsDto{}

export class UpdateDitelsDto extends PartialType(CreateDitelsDto){}