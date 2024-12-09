import { Module } from '@nestjs/common';
import { DiscountService } from './discount.service';
import { DiscountController } from './discount.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { ProductService } from '../product/service/product.service';
import { ProductEnitiy } from '../product/entitis/product.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[AuthModule,TypeOrmModule.forFeature([DiscountEntity,ProductEnitiy])],
  controllers: [DiscountController],
  providers: [DiscountService,ProductService],
  exports: [DiscountService,TypeOrmModule],
})
export class DiscountModule {}
