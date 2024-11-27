import { Body, Controller, Post } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountDto } from './dto/discount.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';

@Controller('discount')
@ApiTags("Discount")
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}
  
  @Post()
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  create(@Body() createDto:DiscountDto){
    return this.discountService.create(createDto)
  }
}
