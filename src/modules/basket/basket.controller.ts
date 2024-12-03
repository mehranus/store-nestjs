import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketDto } from './dto/basket.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';
import { DiscountBasketDto } from './dto/discount.dto';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get()
  Basket(){}

  @Post('add')
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  addToBasket(@Body() basketDto:BasketDto){
    return this.basketService.addToBasket(basketDto)
  }
  @Post('add-discount')
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  addDiscountToBasket(@Body() discountDto:DiscountBasketDto){
    return this.basketService.addDiscountBasket(discountDto)
  }

  @Delete('remove')
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  removeFromBasket(@Body() basketDto:BasketDto){
    return this.basketService.removeFromBasket(basketDto)
  }
  @Delete('remove/:id')
  removeFromBasketById(@Param("id", ParseIntPipe) id:number){
    return this.basketService.removeFromBasketById(id)
  }
  @Delete('remove-discont')
  removeDiscountFromBasket(){}
}
