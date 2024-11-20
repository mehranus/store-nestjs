import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from "@nestjs/common";

import { CreateDitelsDto, UpdateDitelsDto } from "../dto/Product.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { TypeData } from "src/common/enum/type-data.enum";
import { ProductDitelService } from "../service/product-ditels.service";

@Controller("product-ditels")
@ApiTags("Product-Detils")
export class ProductDetilsController {
  constructor(private readonly productDitelService: ProductDitelService) {}

  @Post()
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json, TypeData.MultipartData)
  create(@Body() ditelsDto: CreateDitelsDto) {
    return this.productDitelService.create(ditelsDto)
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() ditelsDto: UpdateDitelsDto
  ) {
    return this.productDitelService.update(id,ditelsDto)
  }

  @Get(":productId")
  find( @Param("productId", ParseIntPipe) productId: number,) {
    return this.productDitelService.find(productId)
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.productDitelService.delete(id)
  }
}
