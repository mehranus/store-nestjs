import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/pament.entity';
import { Repository } from 'typeorm';
import { BasketService } from '../basket/basket.service';
import { ZarinPallService } from '../http/zarinpall.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private readonly paymentRepository:Repository<PaymentEntity>,
    private readonly basketServise:BasketService,
    private readonly zarinpallServise:ZarinPallService
  ){}

  async create(){
    const basket=await this.basketServise.getBasket()
    const data:any={
      amount:basket.finalAmount,
      description:"خرید شما به ما اعتبار میدهد",
      user:{
        email:"m3hr4nus@gmail.com",
        phone:"09115654971"
      }
    }
    return await this.zarinpallServise.sendRequest(data)
  
  }
  async find(){}
}
