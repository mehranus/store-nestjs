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
import { CreateProductDto, UpdateProductDto } from "../dto/Product.dto";
import { ApiConsumes, ApiTags } from "@nestjs/swagger";
import { TypeData } from "src/common/enum/type-data.enum";

@Controller("product")
@ApiTags("Product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json, TypeData.MultipartData)
  create(@Body() productDto: CreateProductDto) {
    return this.productService.create(productDto);
  }
  @Put(":id")
  @ApiConsumes(TypeData.UrlEncoded, TypeData.Json, TypeData.MultipartData)
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() productDto: UpdateProductDto
  ) {
    return this.productService.update(id, productDto);
  }

  @Get()
  find() {
    return this.productService.find();
  }
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  @Delete(":id")
  delete(@Param("id", ParseIntPipe) id: number) {
    return this.productService.delete(id);
  }
}
