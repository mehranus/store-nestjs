import { ApiProperty } from "@nestjs/swagger";

export class DiscountBasketDto{
  @ApiProperty()
  code:string
}