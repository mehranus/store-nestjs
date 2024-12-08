import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/pament.entity';
import { BasketService } from '../basket/basket.service';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketEntity } from '../basket/entitis/basket.entity';

@Module({
  imports:[DiscountModule,ProductModule,TypeOrmModule.forFeature([PaymentEntity,BasketEntity])],
  controllers: [PaymentController],
  providers: [PaymentService,BasketService],
})
export class PaymentModule {}
