import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductColorEnitiy } from "./product-color.entity";
import { ProductDitelsEnitiy } from "./product-ditels.entity";
import { ProductSizeEnitiy } from "./product-size.entity";
import { TypeProduct } from "../enum/product.enum";
import { BasketEntity } from "src/modules/basket/entitis/basket.entity";
import { OredrItemEntity } from "src/modules/order/entitis/order-item.entity";


@Entity(EntityName.Product)
export class ProductEnitiy{
  @PrimaryGeneratedColumn("increment")
  id:number
  @Column()
  titel:string
  @Column()
  content:string
  @Column()
  slug:string
  @Column({enum:TypeProduct})
  type:string
  @Column()
  code:string
  @Column({default:0})
  count:number
  @Column({type:'decimal',nullable:true})
  price:number
  @Column({type:'decimal',nullable:true,default:0})
  discount:number
  @Column({default:false})
  active_discount:boolean
  
    @OneToMany(()=>ProductColorEnitiy,color=>color.product)
    color:ProductColorEnitiy[]
    @OneToMany(()=>ProductDitelsEnitiy,ditel=>ditel.product)
    ditels:ProductDitelsEnitiy[]
    @OneToMany(()=>ProductSizeEnitiy,size=>size.product)
    size:ProductSizeEnitiy[]
    @OneToMany(()=>BasketEntity,basket=>basket.product)
    basket:BasketEntity[]
    @OneToMany(()=>OredrItemEntity,item=>item.product)
    orders:OredrItemEntity[]

  @CreateDateColumn()
  created_at:Date

}