import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger"
import { TypeProduct } from "../enum/product.enum"
import { IsDecimal, IsNumberString, IsString, Length } from "class-validator"

export class CreateProductDto{
  @ApiProperty()
  @IsString()
  @Length(2,25)
  titel:string
  @ApiProperty()
  @IsString()
  @Length(5,100)
  content:string
  @ApiPropertyOptional()
  slug:string
  @ApiProperty({enum:TypeProduct,format:"enum"})
  type:string
  @ApiProperty()
  @IsString()
  @Length(5,10)
  code:string
  @ApiPropertyOptional()
  @IsNumberString()
  count:number
  @ApiPropertyOptional({format:'decimal'})
  @IsDecimal()
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
  @IsString()
  @Length(2,10)
  color_name:string
  @ApiProperty()
  @IsString()
  @Length(4,10)
  color_code:string

  @ApiProperty()
  productId:number
  @ApiProperty()
  count:number
  @ApiProperty({format:'decimal'})
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
  @IsString()
  @Length(1,6)
  size:string
  @ApiProperty()
  productId:number
  @ApiProperty()
  count:number
  @ApiProperty({format:'decimal'})
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
  @IsString()
  @Length(2,50)
  key:string
  @ApiProperty()
  @IsString()
  @Length(2,50)
  value:string
  @ApiProperty()
  productId:number
}

export class UpdateDitelsDto extends PartialType(CreateDitelsDto){}