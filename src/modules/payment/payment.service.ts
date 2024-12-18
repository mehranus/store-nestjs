import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
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
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entity/user.entity';
import { UserAdressEntity } from '../user/entity/addres.entity';

@Injectable({scope:Scope.REQUEST})
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private readonly paymentRepository:Repository<PaymentEntity>,
    @InjectRepository(OrderEntity) private readonly orderRepository:Repository<OrderEntity>,
    @InjectRepository(OredrItemEntity) private readonly orderItemRepository:Repository<OredrItemEntity>,
    @InjectRepository(UserAdressEntity) private readonly userAddresRepository:Repository<UserAdressEntity>,
    private readonly basketServise:BasketService,
    private readonly zarinpallServise:ZarinPallService,
    @Inject(REQUEST) private readonly req:Request
  ){}

  async create(addressDto:AddressDto){
    const {id:userId}=this.req.user
    const {addressId}=addressDto

    const address=await this.userAddresRepository.findOneBy({id:addressId,userId})
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
      addresId:address.id,
      status:OrderStatus.Pending,
      userId
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
      odrerId:order.id,
      userId
    })

    payment =await this.paymentRepository.save(payment)
    order.paymentId=payment.id
    await this.orderRepository.save(order)
    return {gatewayURl}
  
  }
  async verify(authority:string,status:string){
    const payment =await this.paymentRepository.findOneBy({authority})
    if(!payment) throw new NotFoundException("payment not found")
    if(payment.status) throw new BadRequestException("already verifaid payment")
    if(status == "OK"){
      const order=await this.orderRepository.findOneBy({id:payment.odrerId})
      if(!order) throw new NotFoundException("not found payement")
        order.status=OrderStatus.Ordered
      payment.status=true
      await Promise.all([
        this.orderRepository.save(order),
        this.paymentRepository.save(payment)
      ])

      return 'http://frontend.ir/payment/sucess?order_on='+order.id
    } else{
      return 'http://frontend.ir/payment/failed'
    } 
  }

  async find(){
    return await this.paymentRepository.find({
      order:{
        created_at:'DESC'
      }
    })
  }
}
