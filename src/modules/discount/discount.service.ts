import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ProductService } from '../product/service/product.service';
import { DiscountDto } from './dto/discount.dto';
import { toBoolean } from 'src/common/utils/function.util';
import { DiscountType } from './enum/discount.enum';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity) private readonly discountRepository:Repository<DiscountEntity>,
    private readonly productServise:ProductService
  ){}

  async create(createDto:DiscountDto){
    const {active,amount,code,expierIn,limit,percent,productId,type}=createDto
    const productObject:DeepPartial<DiscountEntity>={}


    const codecheck=await this.getCodeDiscount(code)
    if (codecheck) throw new ConflictException("alredy code befor exist!")
    productObject['code']=code;
    productObject['active']=toBoolean(active)


    if(type == DiscountType.Product){
      const product=await this.productServise.findOneLaet(productId)
        productObject['productId']=product.id
      productObject['type']=DiscountType.Product
    }  else{
      productObject['type']=DiscountType.Basket
    }

    if(limit && !isNaN(parseInt(limit.toString()) )) productObject['limit']=+limit


    if((!amount && !percent) || (amount && percent)){
      throw new BadRequestException("you should enter amount or percent")
    }


    if(amount && isNaN(parseInt(amount.toString()))){
      throw new BadRequestException("shoud amount is number")
    }else if(amount){
      productObject['amount']=+amount
    }else  if(percent && isNaN(parseInt(percent.toString()))){
      throw new BadRequestException("shoud persent is number")
    }else if(percent) productObject['percent']=+percent


     if(expierIn && new Date(expierIn).toString() == 'Invalid Date'){
      throw new BadRequestException("time is invalid type!")
     }else productObject['expierIn']=new Date(expierIn)

     await this.discountRepository.save(productObject)
     return {
      message:"create discount susessfully"
     }

  }

  async getCodeDiscount(code:string){
    const discount =await this.discountRepository.findOneBy({code})
    return discount
  }
}
