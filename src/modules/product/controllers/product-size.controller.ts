import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../product.service';
import {  CreateSizeDto, UpdateSizeDto } from '../dto/Product.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';


@Controller('product-size')
@ApiTags('Product-Size')
export class ProductSizeController {
  constructor(private readonly productService: ProductService) {
  }

  
  @Post()
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json,TypeData.MultipartData)
  create(@Body() sizeDto:CreateSizeDto){
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json,TypeData.MultipartData)
  update(@Param("id", ParseIntPipe)id:number,@Body() sizeDto:UpdateSizeDto){
  }

  @Get()
  find(){
  }

  @Delete(':id')
  delete(@Param("id", ParseIntPipe)id:number){}
}
