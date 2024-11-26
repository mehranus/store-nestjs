import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEnitiy } from "../entitis/product.entity";
import { DeepPartial, Repository } from "typeorm";
import { CreateDitelsDto, CreateProductDto, UpdateDitelsDto, UpdateProductDto } from "../dto/Product.dto";
import { TypeProduct } from "../enum/product.enum";
import { toBoolean } from "src/common/utils/function.util";
import { ProductDitelsEnitiy } from "../entitis/product-ditels.entity";
import { ProductService } from "./product.service";

@Injectable()
export class ProductDitelService {
  constructor(
    @InjectRepository(ProductDitelsEnitiy)
    private readonly productDitelRepository: Repository<ProductDitelsEnitiy>,
    private readonly productServise:ProductService
  ) {}

  async create(ditelDto: CreateDitelsDto) {
    const {key,productId,value}=ditelDto
    await this.productServise.findOneLaet(productId)
    await this.productDitelRepository.insert({key,value,productId})
    return {
      message: "create Product susesfully",
    };
  }

  async update(id: number, ditelDto: UpdateDitelsDto) {
      const {key,productId,value}=ditelDto
      const ditele=await this.findOne(id)
      if(!ditele) throw new NotFoundException()
      if(productId) {
        await this.productServise.findOneLaet(productId)
        ditele.productId=productId
      }  
      if(key) ditele.key=key;
      if(value) ditele.value=value;
      await this.productDitelRepository.save(ditele)
    return {
      message: "update ditele of Product susesfully",
    };
  }

  async find(productId:number) {
    return await this.productDitelRepository.find({
      where: {productId},

    });
  }

  async findOne(id: number) {
    const product = await this.productDitelRepository.findOne({
      where: { id },
    });
    if (!product) throw new NotFoundException();
    return product;
  }


  async delete(id: number) {
    await this.findOne(id);
    await this.productDitelRepository.delete(id);
    return {
      message: "deleted  of product-ditelses sucsesfully",
    };
  }
}
