import { BadRequestException, Injectable } from '@nestjs/common';
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

@Injectable()
export class BasketService {
  constructor(
    @InjectRepository(BasketEntity) private readonly baketRepository:Repository<BasketEntity>,
    private readonly productServis:ProductService,
    private readonly productColorServis:ProductcolorService,
    private readonly productSizeServis:ProductSizeService,
  ){}

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
}
