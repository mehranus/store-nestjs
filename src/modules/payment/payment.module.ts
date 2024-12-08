import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/pament.entity';
import { BasketService } from '../basket/basket.service';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketEntity } from '../basket/entitis/basket.entity';
import { HttpApiModules } from '../http/http.module';
import { OredrItemEntity } from '../order/entitis/order-item.entity';
import { OrderEntity } from '../order/entitis/order.entity';

@Module({
  imports:[DiscountModule,ProductModule,HttpApiModules,TypeOrmModule.forFeature([PaymentEntity,BasketEntity,OredrItemEntity,OrderEntity])],
  controllers: [PaymentController],
  providers: [PaymentService,BasketService],
})
export class PaymentModule {}
