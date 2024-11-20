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
  @ApiPropertyOptional()
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
export class CreateColorDto{
  @ApiProperty()
  color_name:string
  @ApiProperty()
  color_code:string

  @ApiProperty()
  productId:number
  @ApiProperty()
  count:number
  @ApiPropertyOptional({format:'decimal'})
  price:number
  @ApiPropertyOptional({format:'decimal',default:0})
  discount:number
  @ApiPropertyOptional({default:false})
  active_discount:boolean
}

export class UpdateColorDto extends PartialType(CreateColorDto){}


//! Size
export class CreateSizeDto{
  @ApiProperty()
  size:string


  @ApiProperty()
  productId:number
  @ApiProperty()
  count:number
  @ApiPropertyOptional({format:'decimal'})
  price:number
  @ApiPropertyOptional({format:'decimal',default:0})
  discount:number
  @ApiPropertyOptional({default:false})
  active_discount:boolean
}

export class UpdateSizeDto extends PartialType(CreateSizeDto){}


//! Ditels
export class CreateDitelsDto{
  @ApiProperty()
  key:string
  @ApiProperty()
  value:string

  @ApiProperty()
  productId:number
}

export class UpdateDitelsDto extends PartialType(CreateDitelsDto){}