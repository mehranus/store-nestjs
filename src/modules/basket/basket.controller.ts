import { Controller, Delete, Get, Post } from '@nestjs/common';
import { BasketService } from './basket.service';

@Controller('basket')
export class BasketController {
  constructor(private readonly basketService: BasketService) {}

  @Get()
  Basket(){}

  @Post('add')
  addToBasket(){}
  @Post('add-discount')
  addDiscountToBasket(){}

  @Delete('remove')
  removeFromBasket(){}
  @Delete('remove-discont')
  removeDiscountFromBasket(){}
}
