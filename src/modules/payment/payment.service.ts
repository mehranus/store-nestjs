import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentEntity } from './entity/pament.entity';
import { Repository } from 'typeorm';
import { BasketService } from '../basket/basket.service';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentEntity) private readonly paymentRepository:Repository<PaymentEntity>,
    private readonly basketServise:BasketService
  ){}

  async create(){
    const basket=await this.basketServise.getBasket()
    return basket
  }
  async find(){}
}
