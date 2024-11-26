import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEnitiy } from "../entitis/product.entity";
import { DataSource, DeepPartial, Repository } from "typeorm";
import { CreateDitelsDto, CreateProductDto, CreateSizeDto, UpdateDitelsDto, UpdateProductDto } from "../dto/Product.dto";
import { TypeProduct } from "../enum/product.enum";
import { toBoolean } from "src/common/utils/function.util";
import { ProductDitelsEnitiy } from "../entitis/product-ditels.entity";
import { ProductService } from "./product.service";
import { ProductSizeEnitiy } from "../entitis/product-size.entity";

@Injectable()
export class ProductSizeService {
  constructor(
    @InjectRepository(ProductSizeEnitiy)
    private readonly productSizeRepository: Repository<ProductSizeEnitiy>,
    @InjectRepository(ProductEnitiy)
    private readonly productRepository: Repository<ProductEnitiy>,
    private readonly productServise:ProductService,
    private readonly dataSorece:DataSource
    
  ) {}

  async create(sizeDto: CreateSizeDto) {
    const {active_discount,count,discount,price,productId,size}=sizeDto
    const queryRunner=this.dataSorece.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()
      let product=await this.productServise.findOneLaet(productId)

      await this.productSizeRepository.insert({
        size,
        active_discount:toBoolean(active_discount),
        count,
        discount,
        price,
        productId
      })
      if(count > 0){
        product.count=count + product.count
      }
      await this.productRepository.save(product)

      await queryRunner.commitTransaction()
      await queryRunner.release()
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new BadRequestException(err)
      
    }
   
  }


}
