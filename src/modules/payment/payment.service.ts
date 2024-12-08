import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/pament.entity';
import { Repository } from 'typeorm';
import { BasketService } from '../basket/basket.service';
import { ZarinPallService } from '../http/zarinpall.service';
import { OredrItemEntity } from '../order/entitis/order-item.entity';
import { OrderEntity } from '../order/entitis/order.entity';
import { OrderStatus } from '../order/enum/order.enum';
import * as shortid from 'shortid';
import { AddressDto } from './dto/payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private readonly paymentRepository:Repository<PaymentEntity>,
    @InjectRepository(OrderEntity) private readonly orderRepository:Repository<OrderEntity>,
    @InjectRepository(OredrItemEntity) private readonly orderItemRepository:Repository<OredrItemEntity>,
    private readonly basketServise:BasketService,
    private readonly zarinpallServise:ZarinPallService
  ){}

  async create(addressDto:AddressDto){
    const {address}=addressDto
    const basket=await this.basketServise.getBasket()
    const data:any={
      amount:basket.finalAmount,
      description:"خرید شما به ما اعتبار میدهد",
      user:{
        email:"m3hr4nus@gmail.com",
        phone:"09115654971"
      }
    }
    let order= this.orderRepository.create({
      total_amount:basket.totalPrice,
      discount_amount:basket.totalDiscountAmount,
      final_amount:basket.finalAmount,
      address,
      status:OrderStatus.Pending
    })
    order=await this.orderRepository.save(order)


    let orderItem=basket.products.map((product)=>{
      return{
        orderId:order.id,
        productId:product.id,
        sizeId:product?.sizeId,
        colorId:product?.colorId,
        count:product.count
      }
    })
   
    await this.orderItemRepository.insert(orderItem)

    const {authority,gatewayURl}= await this.zarinpallServise.sendRequest(data)

    let payment=this.paymentRepository.create({
      amount:basket.finalAmount,
      authority,
      status:false,
      invoice_number:shortid.generate(),
      odrerId:order.id
    })

    payment =await this.paymentRepository.save(payment)
    order.paymentId=payment.id
    await this.orderRepository.save(order)
    return {gatewayURl}
  
  }
  async find(){}
}
