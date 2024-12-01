import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEnitiy } from "../entitis/product.entity";
import { DataSource, DeepPartial, Repository } from "typeorm";
import { CreateDitelsDto, CreateProductDto, CreateSizeDto, UpdateDitelsDto, UpdateProductDto, UpdateSizeDto } from "../dto/Product.dto";
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
    const queryRunner=this.dataSorece.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()
      const {active_discount,count,discount,price,productId,size}=sizeDto
      let product=await queryRunner.manager.findOneBy(ProductEnitiy,{id:productId})
    
      if (!product) throw new NotFoundException("product not found!")
        if(product.type !== TypeProduct.Sizing) throw new BadRequestException("product type is not  sizeing!")
        
      await queryRunner.manager.insert(ProductSizeEnitiy,{
        size,
        active_discount:toBoolean(active_discount),
        count,
        discount,
        price,
        productId
      })
    
      if(!isNaN(parseInt(count.toString())) && +count > 0){
        product.count=parseInt(count.toString()) + parseInt(product.count.toString())
        await queryRunner.manager.save(ProductEnitiy,product)
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()
      return{
        message:"created Size-Product Succesfully"
      }
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new BadRequestException(err)
      
    }
   
  }
  async update(id:number,sizeDto: UpdateSizeDto) {
    const queryRunner=this.dataSorece.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()
      const {active_discount,count,discount,price,productId,size:sizeTitle}=sizeDto
      let product=await queryRunner.manager.findOneBy(ProductEnitiy,{id:productId})
      if (!product) throw new NotFoundException("product not found!")
      let size=await queryRunner.manager.findOneBy(ProductSizeEnitiy,{id})
      if (!size) throw new NotFoundException("size not found!")

       if(sizeTitle) size.size=sizeTitle;
       if(discount) size.discount=discount;
       if(price) size.price=price;
       if(active_discount) size.active_discount=toBoolean(active_discount);

       const perviuseCount=size.count

       if(!isNaN(parseInt(count.toString())) && +count > 0){
        product.count=parseInt(product.count.toString())-parseInt(perviuseCount.toString())
        product.count=parseInt(count.toString()) + parseInt(product.count.toString())
        size.count=count
        await queryRunner.manager.save(ProductEnitiy,product)
      }
      await queryRunner.manager.save(ProductSizeEnitiy,size)

      await queryRunner.commitTransaction()
      await queryRunner.release()
      return{
        message:"Update Size-Product Succesfully"
      }
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new BadRequestException(err)
      
    }
   
  }



  async find(productId:number) {
    return await this.productSizeRepository.find({
      where: {productId},

    });
  }

  async findOne(id: number) {
    const size = await this.productSizeRepository.findOne({
      where: { id },
    });
    if (!size) throw new NotFoundException();
    return size;
  }


  async delete(id: number) {
    const queryRunner=this.dataSorece.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()

      const size=await queryRunner.manager.findOneBy(ProductSizeEnitiy,{id})
      if(!size) throw new NotFoundException("Size Product NotFound!")
      const product=await queryRunner.manager.findOneBy(ProductEnitiy,{id:size.productId})
      if(!isNaN(parseInt(size.count.toString())) && +size.count > 0){
        product.count=parseInt(product.count.toString()) - parseInt(size.count.toString())
        await queryRunner.manager.save(ProductEnitiy,product)
      }
      await queryRunner.manager.remove(size)
      await queryRunner.commitTransaction()
      await queryRunner.release()
      return {
        message: "deleted  of product-size sucsesfully",
      };
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw err
      
    }

  }
}
