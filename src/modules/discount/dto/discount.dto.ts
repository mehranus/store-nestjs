import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { DiscountType } from "../enum/discount.enum";

export class DiscountDto{
  @ApiProperty()
  code:string;
  @ApiProperty({enum:DiscountType})
  type:string;

  @ApiPropertyOptional()
  percent:number;
  
  @ApiPropertyOptional()
  amount:number;

  @ApiPropertyOptional()
  expierIn:string

  @ApiPropertyOptional()
  limit:number

  @ApiPropertyOptional()
  productId:number


  @ApiPropertyOptional()
  active:boolean
}