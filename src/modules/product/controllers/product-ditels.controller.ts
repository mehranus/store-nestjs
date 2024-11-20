import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { ProductService } from '../product.service';
import { CreateDitelsDto, UpdateDitelsDto } from '../dto/Product.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';


@Controller('product-ditels')
@ApiTags('Product-Detils')
export class ProductDetilsController {
  constructor(private readonly productService: ProductService) {
  }

  
  @Post()
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json,TypeData.MultipartData)
  create(@Body() ditelsDto:CreateDitelsDto){
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json,TypeData.MultipartData)
  update(@Param("id", ParseIntPipe)id:number,@Body() ditelsDto:UpdateDitelsDto){
  }

  @Get()
  find(){
  }

  @Delete(':id')
  delete(@Param("id", ParseIntPipe)id:number){}
}
