import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
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
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UserEntity } from '../user/entity/user.entity';

@Injectable({scope:Scope.REQUEST})
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity) private readonly baketRepository:Repository<BasketEntity>,
    private readonly productServis:ProductService,
    private readonly productColorServis:ProductcolorService,
    private readonly productSizeServis:ProductSizeService,
    private readonly discountServis:DiscountService,
    @Inject(REQUEST) private readonly req:Request
  ){}



  async getBasket() {
    const {id:userId}=this.req.user
    let products: any[] = [];
    let discounts: any[] = [];
  
    let finalAmount = 0;
    let totalPrice = 0;
    let totalDiscountAmount = 0;
  
    try {
      const items = await this.baketRepository.find({
        where: {userId},
        relations: {
          product: true,
          color: true,
          size: true,
          discount: true
        }
      });
  
      // فیلتر کردن تخفیف‌های محصولی
      const productDiscounts = items.filter(
        itm => itm?.discountId && itm?.discount?.type === DiscountType.Product
      );
  
      // ایجاد یک Map برای جستجوی سریع تخفیف‌ها بر اساس productId
      const discountMap = new Map<number, DiscountEntity>();
      productDiscounts.forEach(discountItem => {
        discountMap.set(discountItem.productId, discountItem.discount);
      });
  
      for (const item of items) {
        const { color, discount, size, product, count } = item;
        let discountAmount = 0;
  
        if (product?.type === TypeProduct.Singel) {
          totalPrice += Number(product.price) || 0;
  
          // اعمال تخفیف فعال محصول
          if (product?.active_discount) {
            const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
              Number(product.price),
              Number(product.discount)
            );
            discountAmount += newDiscountAmount;
            product.price = newPrice;
            totalDiscountAmount += discountAmount;
          }
  
          // اعمال تخفیف‌های محصولی
          const existDiscount = discountMap.get(product.id);
          if (existDiscount && this.validateDiscount(existDiscount)) {
            discounts.push({
              percent: existDiscount.percent,
              amount: existDiscount.amount,
              productId: existDiscount.productId,
              type: existDiscount.type,
              code: existDiscount.code,
            });
  
            if (existDiscount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                product.discount,
                existDiscount.percent
              );
              product.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (existDiscount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                product.price,
                existDiscount.amount
              );
              product.price = newPrice;
              discountAmount += newDiscountAmount;
            }
            totalDiscountAmount += discountAmount;
          }
  
          finalAmount += product.price * (count || 0);
  
          products.push({
            id: product.id,
            slug: product.slug,
            title: product.titel,
            active_discount: product.active_discount,
            discount: product.discount,
            price: product.price,
            count: count || 0
          });
  
        } else if (product?.type === TypeProduct.Sizing) {
          // اعمال تخفیف برای محصولات با سایز
          totalPrice += Number(size.price) || 0;
  
          if (size?.active_discount) {
            const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
              Number(size.price),
              Number(size.discount)
            );
            discountAmount += newDiscountAmount;
            size.price = newPrice;
            totalDiscountAmount += discountAmount;
          }
  
          const existDiscount = discountMap.get(product.id);
          if (existDiscount && this.validateDiscount(existDiscount)) {
            discounts.push({
              percent: existDiscount.percent,
              amount: existDiscount.amount,
              code: existDiscount.code,
              type: existDiscount.type,
              productId: existDiscount.productId,
            });
  
            if (existDiscount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                size.price,
                existDiscount.percent
              );
              size.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (existDiscount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                size.price,
                existDiscount.amount
              );
              size.price = newPrice;
              discountAmount += newDiscountAmount;
            }
            totalDiscountAmount += discountAmount;
          }
  
          finalAmount += Number(size.price) * (count || 0);
          products.push({
            id: product.id,
            slug: product.slug,
            title: product.titel,
            active_discount: size.active_discount,
            discount: size.discount,
            sizeId: size.id,
            price: size.price,
            size: size.size,
            count: count || 0
          });
  
        } else if (product?.type === TypeProduct.Coloring) {
          // اعمال تخفیف برای محصولات با رنگ
          totalPrice += Number(color.price) || 0;
  
          if (color?.active_discount) {
            const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
              Number(color.price),
              Number(color.discount)
            );
            discountAmount += newDiscountAmount;
            color.price = newPrice;
            totalDiscountAmount += discountAmount;
          }
  
          const existDiscount = discountMap.get(product.id);
          if (existDiscount && this.validateDiscount(existDiscount)) {
            discounts.push({
              percent: existDiscount.percent,
              amount: existDiscount.amount,
              code: existDiscount.code,
              type: existDiscount.type,
              productId: existDiscount.productId,
            });
  
            if (existDiscount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                color.price,
                existDiscount.percent
              );
              color.price = newPrice;
              discountAmount += newDiscountAmount;
            } else if (existDiscount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                color.price,
                existDiscount.amount
              );
              color.price = newPrice;
              discountAmount += newDiscountAmount;
            }
            totalDiscountAmount += discountAmount;
          }
  
          finalAmount += Number(color.price) * (count || 0);
  
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
            count: count || 0
          });
  
        } else if (discount && this.validateDiscount(discount)) {
          // اعمال تخفیف‌های سبد خرید
          if (discount.type === DiscountType.Basket) {
            discounts.push({
              percent: discount.percent,
              amount: discount.amount,
              code: discount.code,
              type: discount.type,
              productId: discount.productId,
            });
  
            if (discount.percent) {
              const { newDiscountAmount, newPrice } = this.checkDiscountPercent(
                finalAmount,
                discount.percent
              );
              finalAmount = newPrice;
              discountAmount += newDiscountAmount;
            } else if (discount.amount) {
              const { newDiscountAmount, newPrice } = this.checkDiscountAmount(
                finalAmount,
                discount.amount
              );
              finalAmount = newPrice;
              discountAmount += newDiscountAmount;
            }
            totalDiscountAmount += discountAmount;
          }
        }
      }
  
      return {
        totalPrice,
        finalAmount,
        totalDiscountAmount,
        productDiscounts,
        products,
        discounts,
      };
  
    } catch (error) {
      console.error('Error in getBasket:', error);
      throw new Error('Failed to retrieve basket.');
    }
  }
  



 async addToBasket(basketDto:BasketDto){
    const {id:userId}=this.req.user
    const {colorId,productId,sizeId}=basketDto
    console.log(basketDto,userId)
    let size:ProductSizeEnitiy
    let color:ProductColorEnitiy
    let where:FindOptionsWhere<BasketEntity>={}
    const product=await this.productServis.findOneLaet(productId)
 
    if(product.count == 0) throw new BadRequestException("product invertoy not enough")
    where['productId']=product.id
    where['userId']=userId
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
            count:1,
            userId
          })
        }
        await this.baketRepository.save(basketItem)
        return{
          message:"add product sucesfully"
        }


  }
 async removeFromBasketById(id:number){
     const {id:userId}=this.req.user
    let basketItem=await this.baketRepository.findOneBy({id,userId})
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
   const {id:userId}=this.req.user
    const {colorId,productId,sizeId}=basketDto
    let size:ProductSizeEnitiy
    let color:ProductColorEnitiy
    let where:FindOptionsWhere<BasketEntity>={}
    const product=await this.productServis.findOneLaet(productId)
    where['productId']=product.id
    where['userId']=userId

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
  const {id:userId}=this.req.user
  const discont = await this.discountServis.getCodeDiscount(code)

  if(!discont) throw new NotFoundException('not found discount')
  if(discont.type === DiscountType.Product && discont.productId){
    const basketItem=await this.baketRepository.findOne({
      where:{productId:discont.productId,userId}

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
  const {id:userId}=this.req.user
  const {code}=discountDto
  const discont = await this.discountServis.getCodeDiscount(code)

  if(!discont) throw new NotFoundException('not found discount')
      const existDiscount=await this.baketRepository.findOne({
    where:{discountId:discont.id,userId}
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
  const limitCondition = discount.limit ? discount.limit > discount.usage : true;
  const timeCondition = discount.expierIn ? discount.expierIn > new Date() : true;
  return limitCondition && timeCondition;
}

checkDiscountPercent(price: number, percent: number) {
  if (percent < 0 || percent > 100) {
    throw new Error('درصد تخفیف نامعتبر است');
  }
  const newDiscountAmount = price * (percent / 100);
  const newPrice = newDiscountAmount > price ? 0 : price - newDiscountAmount;
  return {
    newPrice,
    newDiscountAmount,
  };
}

checkDiscountAmount(price: number, amount: number) {
  const newPrice = amount > price ? 0 : price - amount;
  return {
    newPrice,
    newDiscountAmount: amount,
  };
}


}
