import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BasketEntity } from './entitis/basket.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ProductService } from '../product/service/product.service';
import { ProductcolorService } from '../product/service/product-color.service';
import { ProductSizeService } from '../product/service/product-size.service';
import { BasketDto } from './dto/basket.dto';
import { TypeProduct } from '../product/enum/product.enum';
import { ProductSizeEnitiy } from '../product/entitis/product-size.entity';
import { ProductColorEnitiy } from '../product/entitis/product-color.entity';
import { DiscountBasketDto } from './dto/discount.dto';
import { DiscountService } from '../discount/discount.service';
import { DiscountType } from '../discount/enum/discount.enum';
import { DiscountEntity } from '../discount/entities/discount.entity';

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity) private readonly baketRepository:Repository<BasketEntity>,
    private readonly productServis:ProductService,
    private readonly productColorServis:ProductcolorService,
    private readonly productSizeServis:ProductSizeService,
    private readonly discountServis:DiscountService,
  ){}

  async getBasket(){
    let products=[]
    let discounts=[]
 

    let fainalAmont=0
    let totoalPrice=0
    let totoalDiscountAmount=0

    const items=await this.baketRepository.find({
      where:{},
      relations:{
        product:true,
        color:true,
        size:true,
        discount:true
      }
      
    })
   const productDiscounts= items.filter(itm=>itm?.discountId && itm?.discount?.type === DiscountType.Product)
    for (const item of items) {
      const {color,discount,size,product,count}=item
      let discountAmount=0
      if(product?.type == TypeProduct.Singel){
        totoalPrice+= +product.price
        if(product?.active_discount){
          const {newDiscountAmount,newPrice}=this.checkDiscountPercent(
            +product.price,+product.discount
          )
          discountAmount+= newDiscountAmount
          product.price=newPrice
          totoalDiscountAmount += discountAmount
        }

        const existDiscount=productDiscounts.find(dis=>dis.productId === product.id)
        if(existDiscount){
          const {discount}=existDiscount
          if(this.validateDiscount(discount)){
        
            discounts.push({
              persent:discount.percent,
              amount:discount.amount,
              productId:discount.productId,
              type:discount.type,
              code:discount.code
            })
        
          }
        if(discount.percent){
          const {newDiscountAmount,newPrice} =this.checkDiscountPercent(product.discount,discount.percent)
          product.price=newPrice;
          discountAmount=newDiscountAmount
        }else if(discount.amount){
          const {newDiscountAmount,newPrice}=this.checkDiscountAmount(product.price,discount.amount)
          product.price=newPrice
          discountAmount += newDiscountAmount
        }
        totoalDiscountAmount += discountAmount
      }
      
      fainalAmont+= product.price *count
     
      products.push({
        id: product.id,
        slug: product.slug,
        title: product.titel,
        active_discount: product.active_discount,
        discount: product.discount,
        price: product.price,
      });
      } else if (product?.type === TypeProduct.Sizing) {
      totoalPrice += +size.price;
      if (size?.active_discount) {
        const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
          +size.price,
          +size.discount
        );
        discountAmount = newDiscountAmount;
        size.price = newPrice;
      }
      const existDiscount = productDiscounts.find(
        (dis) => dis.productId === product.id
      );
      if (existDiscount) {
        const {discount} = existDiscount;
        if (this.validateDiscount(discount)) {
          discounts.push({
            percent: discount.percent,
            amount: discount.amount,
            code: discount.code,
            type: discount.type,
            productId: discount.productId,
          });
          if (discount.percent) {
            const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
              size.price,
              discount.percent
            );
            size.price = newPrice;
            discountAmount += newDiscountAmount;
          } else if (discount.amount) {
            const {newDiscountAmount, newPrice} = this.checkDiscountAmount(
              size.price,
              discount.amount
            );
            size.price = newPrice;
            discountAmount += newDiscountAmount;
          }
        }
      }
      totoalDiscountAmount += discountAmount;
      fainalAmont += +size.price * count;
      products.push({
        id: product.id,
        slug: product.slug,
        title: product.titel,
        active_discount: size.active_discount,
        discount: size.discount,
        sizeId: size.id,
        price: size.price,
        size: size.size,
      });
    } else if (product?.type === TypeProduct.Coloring) {
      totoalPrice += +color.price;
      if (color?.active_discount) {
        const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
          +color.price,
          +color.discount
        );
        discountAmount = newDiscountAmount;
        color.price = newPrice;
      }
      const existDiscount = productDiscounts.find(
        (dis) => dis.productId === product.id
      );
      if (existDiscount) {
        const {discount} = existDiscount;
        if (this.validateDiscount(discount)) {
          discounts.push({
            percent: discount.percent,
            amount: discount.amount,
            code: discount.code,
            type: discount.type,
            productId: discount.productId,
          });
          if (discount.percent) {
            const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
              color.price,
              discount.percent
            );
            color.price = newPrice;
            discountAmount += newDiscountAmount;
          } else if (discount.amount) {
            const {newDiscountAmount, newPrice} = this.checkDiscountAmount(
              color.price,
              discount.amount
            );
            color.price = newPrice;
            discountAmount += newDiscountAmount;
          }
        }
      }
      totoalDiscountAmount += discountAmount;
      fainalAmont += +color.price * count;
      products.push({
        id: product.id,
        slug: product.slug,
        title: product.titel,
        active_discount: color.active_discount,
        discount: color.discount,
        price: color.price,
        colorId: color.id,
        color_code: color.color_code,
        color_name: color.color_name,
      });
    } else if (discount) {
      if (this.validateDiscount(discount)) {
        if (discount.type === DiscountType.Basket) {
          discounts.push({
            percent: discount.percent,
            amount: discount.amount,
            code: discount.code,
            type: discount.type,
            productId: discount.productId,
          });
          if (discount.percent) {
            const {newDiscountAmount, newPrice} = this.checkDiscountPercent(
              fainalAmont,
              discount.percent
            );
            fainalAmont = newPrice;
            discountAmount = +newDiscountAmount;
          } else if (discount.amount) {
            const {newDiscountAmount, newPrice} = this.checkDiscountAmount(
              fainalAmont,
              discount.amount
            );
            fainalAmont = newPrice;
            discountAmount = newDiscountAmount;
          }
          totoalDiscountAmount += discountAmount;
        }
      }
    }
    }
  return {
    totoalPrice,
    fainalAmont,
    totoalDiscountAmount,
    productDiscounts,
    products,
    discounts,
  };

    

   
  }


 async addToBasket(basketDto:BasketDto){

    const {colorId,productId,sizeId}=basketDto
    let size:ProductSizeEnitiy
    let color:ProductColorEnitiy
    let where:FindOptionsWhere<BasketEntity>={}
    const product=await this.productServis.findOneLaet(productId)
    if(product.count == 0) throw new BadRequestException("product invertoy not enough")
    where['productId']=product.id
    if(product.type === TypeProduct.Sizing && !sizeId){throw new BadRequestException("you sholud select a size")}
    else if(product.type === TypeProduct.Sizing && sizeId){
     
      if(isNaN(parseInt(sizeId.toString()))){
        throw new BadRequestException("you sholud select a size")
      }
      size=await this.productSizeServis.findOne(sizeId)
      where['sizeId']=sizeId
    }else if(product.type === TypeProduct.Coloring && !colorId){ throw new BadRequestException("you sholud select some color")}
    else if(product.type === TypeProduct.Coloring && colorId){
      if(isNaN(parseInt(colorId.toString()))){
        throw new BadRequestException("you sholud select a size")
      }
      color = await this.productColorServis.findOne(colorId)
      where['colorId']=colorId
    }

    let basketItem=await this.baketRepository.findOneBy(where)
    if(basketItem){
      basketItem.count+=1
      if(basketItem.count > product.count) throw new BadRequestException("product invertoy not enough")
    }else{
          basketItem=this.baketRepository.create({
            productId,
            colorId:color?.id,
            sizeId:size?.id,
            count:1
          })
        }
        await this.baketRepository.save(basketItem)
        return{
          message:"add product sucesfully"
        }


  }
 async removeFromBasketById(id:number){

    let basketItem=await this.baketRepository.findOneBy({id})
    if(basketItem){
      if(basketItem.count <= 1){
        await this.baketRepository.delete({id:basketItem.id})
      }else{
        basketItem.count-=1
        await this.baketRepository.save(basketItem)
      }
     
        return{
          message:"remove product from basket sucesfully"
        }


  }


}
 async removeFromBasket(basketDto:BasketDto){

    const {colorId,productId,sizeId}=basketDto
    let size:ProductSizeEnitiy
    let color:ProductColorEnitiy
    let where:FindOptionsWhere<BasketEntity>={}
    const product=await this.productServis.findOneLaet(productId)
    where['productId']=product.id

    if(product.type === TypeProduct.Sizing && !sizeId){throw new BadRequestException("you sholud select a size")}
    else if(product.type === TypeProduct.Coloring && sizeId){
      if(isNaN(parseInt(sizeId.toString()))){
        throw new BadRequestException("you sholud select a size")
      }
      size=await this.productSizeServis.findOne(sizeId)
      where['sizeId']=size.id
    }else if(product.type === TypeProduct.Coloring && !colorId){ throw new BadRequestException("you sholud select some color")}
    else if(product.type === TypeProduct.Coloring && colorId){
      if(isNaN(parseInt(colorId.toString()))){
        throw new BadRequestException("you sholud select a size")
      }
      color = await this.productColorServis.findOne(colorId)
      where['colorId']=color.id
    }
    let basketItem=await this.baketRepository.findOneBy(where)
    if(basketItem){
      if(basketItem.count <= 1){
        await this.baketRepository.delete({id:basketItem.id})
      }else{
        basketItem.count-=1
        await this.baketRepository.save(basketItem)
      }
     
        return{
          message:"remove product from basket sucesfully"
        }


  }


}
async addDiscountBasket(discountDto:DiscountBasketDto){
  const {code}=discountDto
  const discont = await this.discountServis.getCodeDiscount(code)

  if(!discont) throw new NotFoundException('not found discount')
  if(discont.type === DiscountType.Product && discont.productId){
    const basketItem=await this.baketRepository.findOneBy({
      productId:discont.productId
    })
   
    if(!basketItem) throw new BadRequestException('not found item for discount code')
  }
    if(discont.limit && (discont.limit >= 0 || discont.usage > discont.limit)) throw new BadRequestException("discount code is limited")
    if(discont.expierIn && discont.expierIn <= new Date()) throw new BadRequestException(" discount code is expiered")
    const existDiscount=await this.baketRepository.findOneBy({
      discountId:discont.id
        }) 
    if(existDiscount) throw new BadRequestException("alredy code discount exist")  
    if(discont.type === DiscountType.Basket){
      const item =await this.baketRepository.findOne({
        relations:{discount:true},
        where:{discount:{type:DiscountType.Basket}}
      })
      console.log(item)
      if(item)throw new BadRequestException("alredy code discount exist") 
      } 
      await this.baketRepository.insert({
        productId:discont?.productId,
        discountId:discont.id,
        count:0
      })  
      return {
        message:"add discount sucesfully"
      }

   
}
async removeDiscountBasket(discountDto:DiscountBasketDto){
  const {code}=discountDto
  const discont = await this.discountServis.getCodeDiscount(code)

  if(!discont) throw new NotFoundException('not found discount')
      const existDiscount=await this.baketRepository.findOneBy({
      discountId:discont.id
        }) 
    if(existDiscount) {
      await this.baketRepository.delete({id:existDiscount.id})
    }else{
      throw new NotFoundException('not found discount')
    }  
    
      return {
        message:"remove discount from basket sucesfully"
      }

   
}

validateDiscount(discount: DiscountEntity) {
  let limitCondition = discount.limit && discount.limit > discount.usage;
  let timeCondition = discount.expierIn && discount.expierIn > new Date();
  return limitCondition || timeCondition;
}
checkDiscountPercent(price: number, percent: number) {
  let newDiscountAmount = +price * (+percent / 100);
  let newPrice = +newDiscountAmount > +price ? 0 : +price - newDiscountAmount;
  return {
    newPrice,
    newDiscountAmount,
  };
}
checkDiscountAmount(price: number, amount: number) {
  let newPrice = +amount > +price ? 0 : +price - +amount;
  return {
    newPrice,
    newDiscountAmount: +amount,
  };
}



}
