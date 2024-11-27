import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiscountEntity } from './entities/discount.entity';
import { DeepPartial, Repository } from 'typeorm';
import { ProductService } from '../product/service/product.service';
import { DiscountDto, UpdateDiscountDto } from './dto/discount.dto';
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
    const discountObject:DeepPartial<DiscountEntity>={}


    const codecheck=await this.getCodeDiscount(code)
    if (codecheck) throw new ConflictException("alredy code befor exist!")
    discountObject['code']=code;
    discountObject['active']=toBoolean(active)


    if(type == DiscountType.Product){
      const product=await this.productServise.findOneLaet(productId)
        discountObject['productId']=product.id
      discountObject['type']=DiscountType.Product
    }  else{
      discountObject['type']=DiscountType.Basket
    }

    if(limit && !isNaN(parseInt(limit.toString()) )) discountObject['limit']=+limit


    if((!amount && !percent) || (amount && percent)){
      throw new BadRequestException("you should enter amount or percent")
    }


    if(amount && isNaN(parseInt(amount.toString()))){
      throw new BadRequestException("shoud amount is number")
    }else if(amount){
      discountObject['amount']=+amount
    }else  if(percent && isNaN(parseInt(percent.toString()))){
      throw new BadRequestException("shoud persent is number")
    }else if(percent) discountObject['percent']=+percent


     if(expierIn && new Date(expierIn).toString() == 'Invalid Date'){
      throw new BadRequestException("time is invalid type!")
     }else discountObject['expierIn']=new Date(expierIn)

     await this.discountRepository.save(discountObject)
     return {
      message:"create discount susessfully"
     }

  }
  async update(id:number,updateDto:UpdateDiscountDto){
    const discount=await this.checkDiscount(id)
    const {active,amount,code,expierIn,limit,percent,productId,type}=updateDto
   


    const codecheck=await this.getCodeDiscount(code)
    if (codecheck && codecheck.id !== id) throw new ConflictException("alredy code befor exist!")
      discount.code=code;
    discount.active=toBoolean(active)


    if(type == DiscountType.Product && productId){
     
       discount.productId=productId
      discount.type=DiscountType.Product
    }  else if(type == DiscountType.Basket){
      discount.type=DiscountType.Basket
    }

    if(limit && !isNaN(parseInt(limit.toString()) )) discount.limit=+limit


    if(amount && percent){
      throw new BadRequestException("you should enter amount or percent")
    }


    if(amount && isNaN(parseInt(amount.toString()))){
      throw new BadRequestException("shoud amount is number")
    }else if(amount){
      discount.amount=+amount
    }else  if(percent && isNaN(parseInt(percent.toString()))){
      throw new BadRequestException("shoud persent is number")
    }else if(percent) discount.percent=+percent


     if(expierIn && new Date(expierIn).toString() == 'Invalid Date'){
      throw new BadRequestException("time is invalid type!")
     }else if(expierIn) discount.expierIn=new Date(expierIn)

     await this.discountRepository.save(discount)
     return {
      message:"update discount susessfully"
     }

  }

  async find(){
    return await this.discountRepository.find()
  }
  async delete(id:number){
    await this.checkDiscount(id)
    await this.discountRepository.delete({id})
    return{
      message:"deleted discount sucsesfully"
    }
  }

  async getCodeDiscount(code:string){
    const discount =await this.discountRepository.findOneBy({code})
    return discount
  }

  async checkDiscount(id:number){
    const discount=await this.discountRepository.findOneBy({id})
    if(!discount) throw new NotFoundException("discount not found!")
      return discount
  }
}
