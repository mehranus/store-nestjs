import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../product.service';
import { CreateColorDto, UpdateColorDto } from '../dto/Product.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';

@Controller('product-color')
@ApiTags("Product-Color")
export class ProductColorController {
  constructor(private readonly productService: ProductService) {}

    
  @Post()
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  create(@Body() colorDto:CreateColorDto){
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  update(@Param("id", ParseIntPipe)id:number,@Body() colorDto:UpdateColorDto){
  }

  @Get()
  find(){
  }

  @Delete(':id')
  delete(@Param("id", ParseIntPipe)id:number){}
}
