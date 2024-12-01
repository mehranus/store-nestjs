import { Module } from '@nestjs/common';
import { BasketService } from './basket.service';
import { BasketController } from './basket.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BasketEntity } from './entitis/basket.entity';
import { ProductModule } from '../product/product.module';

@Module({
  imports:[ProductModule,TypeOrmModule.forFeature([BasketEntity])],
  controllers: [BasketController],
  providers: [BasketService],
})
export class BasketModule {}
