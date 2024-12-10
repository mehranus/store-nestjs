import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNumberString, IsOptional } from "class-validator";


export class BasketDto{
  @ApiProperty()
  @IsNumberString()
  productId:number
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  colorId:number
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  sizeId:number
}