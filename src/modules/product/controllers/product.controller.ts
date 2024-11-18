import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../product.service';
import { CreateProductDto } from '../dto/Product.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';


@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {
  }

  
  @Post()
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json,TypeData.MultipartData)
  create(@Body() productDto:CreateProductDto){
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json,TypeData.MultipartData)
  update(@Param("id", ParseIntPipe)id:number,@Body() productDto:CreateProductDto){
  }

  @Get()
  find(){
  }

  @Delete(':id')
  delete(@Param("id", ParseIntPipe)id:number){}
}
