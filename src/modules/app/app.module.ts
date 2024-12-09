import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from 'src/config/typeorm.config';
import { ProductModule } from '../product/product.module';
import { DiscountModule } from '../discount/discount.module';
import { BasketModule } from '../basket/basket.module';
import { PaymentModule } from '../payment/payment.module';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    ProductModule,
    DiscountModule,
    BasketModule,
    PaymentModule,
    OrderModule,
    UserModule,
    TypeOrmModule.forRoot(typeOrmConfig())],
  controllers: [],
  providers: [],
})
export class AppModule {}
