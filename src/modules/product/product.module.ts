import { Module } from "@nestjs/common";
import { ProductService } from "./service/product.service";
import { ProductController } from "./controllers/product.controller";
import { ProductSizeController } from "./controllers/product-size.controller";
import { ProductDetilsController } from "./controllers/product-ditels.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ProductEnitiy } from "./entitis/product.entity";
import { ProductColorEnitiy } from "./entitis/product-color.entity";
import { ProductDitelsEnitiy } from "./entitis/product-ditels.entity";
import { ProductSizeEnitiy } from "./entitis/product-size.entity";
import { ProductColorController } from "./controllers/product-color.controller";
import { ProductDitelService } from "./service/product-ditels.service";
import { ProductSizeService } from "./service/product-size.service";
import { ProductcolorService } from "./service/product-color.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      ProductEnitiy,
      ProductColorEnitiy,
      ProductDitelsEnitiy,
      ProductSizeEnitiy,
    ]),
  ],
  controllers: [
    ProductController,
    ProductSizeController,
    ProductColorController,
    ProductDetilsController,
  ],
  providers: [ProductService,ProductDitelService,ProductSizeService,ProductcolorService],
  exports: [ProductService,ProductDitelService,ProductSizeService,ProductcolorService],
})
export class ProductModule {}
