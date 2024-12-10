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
import { CreateColorDto, UpdateColorDto } from "../dto/Product.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { TypeData } from "src/common/enum/type-data.enum";
import { ProductcolorService } from "../service/product-color.service";
import { UserAuth } from "src/common/decorators/auth.decorator";

@Controller("product-color")
@ApiTags("Product-Color")
@UserAuth()
export class ProductColorController {
  constructor(private readonly productService: ProductcolorService) {}

  @Post()
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json)
  create(@Body() colorDto: CreateColorDto) {
    return this.productService.create(colorDto)
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() colorDto: UpdateColorDto
  ) {
    return this.productService.update(id,colorDto)
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
