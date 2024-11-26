import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductColorEnitiy } from "./product-color.entity";
import { ProductDitelsEnitiy } from "./product-ditels.entity";
import { ProductSizeEnitiy } from "./product-size.entity";
import { TypeProduct } from "../enum/product.enum";


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

  @CreateDateColumn()
  created_at:Date

}