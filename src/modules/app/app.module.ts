import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';


@Module({
  imports: [
    ProductModule,
    DiscountModule,
    TypeOrmModule.forRoot(typeOrmConfig())],
  controllers: [],
  providers: [],
})
export class AppModule {}
