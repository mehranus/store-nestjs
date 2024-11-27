import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountDto, UpdateDiscountDto } from './dto/discount.dto';
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
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateDto: UpdateDiscountDto
  ) {
    return this.discountService.update(id, updateDto);
  }

  @Get()
  find() {
    return this.discountService.find();
  }
 

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.discountService.delete(id);
  }

}
