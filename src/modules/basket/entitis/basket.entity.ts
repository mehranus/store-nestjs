import { EntityName } from "src/common/enum/entity-name.enum";
import { DiscountEntity } from "src/modules/discount/entities/discount.entity";
import { ProductColorEnitiy } from "src/modules/product/entitis/product-color.entity";
import { ProductSizeEnitiy } from "src/modules/product/entitis/product-size.entity";
import { ProductEnitiy } from "src/modules/product/entitis/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity(EntityName.Basket)
export class BasketEntity{
  @PrimaryGeneratedColumn("increment")
  id:number

  @Column({nullable:true})
  productId:number
  @Column({nullable:true})
  colorId:number
  @Column({nullable:true})
  sizeId:number
  @Column({nullable:true})
  discountId:number

  @Column()
  count:number

  @ManyToOne(()=>ProductEnitiy,product=>product.basket,{onDelete:"CASCADE"})
  product:ProductEnitiy
  @ManyToOne(()=>ProductColorEnitiy,color=>color.basket,{onDelete:"CASCADE"})
  color:ProductColorEnitiy
  @ManyToOne(()=>ProductSizeEnitiy,size=>size.basket,{onDelete:"CASCADE"})
  size:ProductSizeEnitiy
  @ManyToOne(()=>DiscountEntity,discount=>discount.basket,{onDelete:"CASCADE"})
  discount:DiscountEntity
}