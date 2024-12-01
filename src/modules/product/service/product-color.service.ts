import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductEnitiy } from "../entitis/product.entity";
import { DataSource, DeepPartial, Repository } from "typeorm";
import { CreateDitelsDto, CreateProductDto, CreateColorDto, UpdateDitelsDto, UpdateProductDto, UpdateColorDto } from "../dto/Product.dto";
import { TypeProduct } from "../enum/product.enum";
import { toBoolean } from "src/common/utils/function.util";
import { ProductDitelsEnitiy } from "../entitis/product-ditels.entity";
import { ProductService } from "./product.service";
import { ProductColorEnitiy } from "../entitis/product-color.entity";

@Injectable()
export class ProductcolorService {
  constructor(
    @InjectRepository(ProductColorEnitiy)
    private readonly productColorRepository: Repository<ProductColorEnitiy>,
    @InjectRepository(ProductEnitiy)
    private readonly productRepository: Repository<ProductEnitiy>,
    private readonly productServise:ProductService,
    private readonly dataSorece:DataSource
    
  ) {}

  async create(colorDto: CreateColorDto) {
    const queryRunner=this.dataSorece.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()
      const {active_discount,color_code,color_name,count,discount,price,productId}=colorDto
      let product=await queryRunner.manager.findOneBy(ProductEnitiy,{id:productId})
    
      if (!product) throw new NotFoundException("product not found!")
        if(product.type !== TypeProduct.Coloring) throw new BadRequestException("product type is not  coloring!")
        
      await queryRunner.manager.insert(ProductColorEnitiy,{
        active_discount:toBoolean(active_discount),
        color_code,
        color_name,
        count,
        discount,
        productId,
        price
      })
    
      if(!isNaN(parseInt(count.toString())) && +count > 0){
        product.count=parseInt(count.toString()) + parseInt(product.count.toString())
        await queryRunner.manager.save(ProductEnitiy,product)
      }

      await queryRunner.commitTransaction()
      await queryRunner.release()
      return{
        message:"created color-Product Succesfully"
      }
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new BadRequestException(err)
      
    }
   
  }
  async update(id:number,colorDto: UpdateColorDto) {
    const queryRunner=this.dataSorece.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()
      const {active_discount,color_code,color_name,count,discount,price,productId}=colorDto
      let product=await queryRunner.manager.findOneBy(ProductEnitiy,{id:productId})
      if (!product) throw new NotFoundException("product not found!")
      let color=await queryRunner.manager.findOneBy(ProductColorEnitiy,{id})
      if (!color) throw new NotFoundException("color not found!")

       if(color_name) color.color_name=color_name;
       if(color_code) color.color_code=color_code;
       if(discount) color.discount=discount;
       if(price) color.price=price;
       if(active_discount) color.active_discount=toBoolean(active_discount);

       const perviuseCount=color.count

       if(!isNaN(parseInt(count.toString())) && +count > 0){
        product.count=parseInt(product.count.toString())-parseInt(perviuseCount.toString())
        product.count=parseInt(count.toString()) + parseInt(product.count.toString())
        color.count=count
        await queryRunner.manager.save(ProductEnitiy,product)
      }
      await queryRunner.manager.save(ProductColorEnitiy,color)

      await queryRunner.commitTransaction()
      await queryRunner.release()
      return{
        message:"Update color-Product Succesfully"
      }
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw new BadRequestException(err)
      
    }
   
  }



  async find(productId:number) {
    return await this.productColorRepository.find({
      where: {productId},

    });
  }

  async findOne(id: number) {
    const color = await this.productColorRepository.findOne({
      where: { id },
    });
    if (!color) throw new NotFoundException();
    return color;
  }


  async delete(id: number) {
    const queryRunner=this.dataSorece.createQueryRunner()
    await queryRunner.connect()
    try {
      await queryRunner.startTransaction()

      const color=await queryRunner.manager.findOneBy(ProductColorEnitiy,{id})
      if(!color) throw new NotFoundException("color Product NotFound!")
      const product=await queryRunner.manager.findOneBy(ProductEnitiy,{id:color.productId})
      if(!isNaN(parseInt(color.count.toString())) && +color.count > 0){
        product.count=parseInt(product.count.toString()) - parseInt(color.count.toString())
        await queryRunner.manager.save(ProductEnitiy,product)
      }
      await queryRunner.manager.remove(color)
      await queryRunner.commitTransaction()
      await queryRunner.release()
      return {
        message: "deleted  of product-color sucsesfully",
      };
    } catch (err) {
      await queryRunner.rollbackTransaction()
      await queryRunner.release()
      throw err
      
    }

  }
}
