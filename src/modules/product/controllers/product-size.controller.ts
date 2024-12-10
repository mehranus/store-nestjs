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
import { ProductService } from "../service/product.service";
import { CreateSizeDto, UpdateSizeDto } from "../dto/Product.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { TypeData } from "src/common/enum/type-data.enum";
import { ProductSizeService } from "../service/product-size.service";
import { UserAuth } from "src/common/decorators/auth.decorator";

@Controller("product-size")
@ApiTags("Product-Size")
@UserAuth()
export class ProductSizeController {
  constructor(private readonly productService: ProductSizeService) {}

  @Post()
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json, TypeData.MultipartData)
  create(@Body() sizeDto: CreateSizeDto) {
    return this.productService.create(sizeDto)
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json, TypeData.MultipartData)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() sizeDto: UpdateSizeDto
  ) {
    return this.productService.update(id,sizeDto)
  }

  @Get(":productId")
  find( @Param("productId", ParseIntPipe) productId: number,) {
    return this.productService.find(productId)
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.productService.delete(id)
  }
}
