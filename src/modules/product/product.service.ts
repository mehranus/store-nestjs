import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEnitiy } from './entitis/product.entity';
import { DeepPartial, Repository } from 'typeorm';
import { CreateProductDto } from './dto/Product.dto';
import { TypeProduct } from './enum/product.enum';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEnitiy) private readonly productRepository:Repository<ProductEnitiy>
  ){}


  async create(productDto:CreateProductDto){
    const {active_discount,code,content,count,discount,price,slug,titel,type}=productDto
    const ObjectProduct:DeepPartial<ProductEnitiy>={
      titel,
      code,
      slug,
      content,
      discount,
      active_discount
    }
    if(type === TypeProduct.Singel){
      Object.assign(ObjectProduct,{count,price,type})
    }else if([TypeProduct.Coloring ,TypeProduct.Sizing].includes(type as any)) ObjectProduct['type']=type

    await this.productRepository.save(ObjectProduct)
    return{
      message:"create Product susesfully"
    }

  }
}
