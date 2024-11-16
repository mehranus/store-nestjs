import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEnitiy } from "./product.entity";


@Entity(EntityName.ProductSize)
export class ProductSizeEnitiy{
  @PrimaryGeneratedColumn("increment")
  id:number
  @Column()
  size:string
  @Column()
  count:number
  @Column({type:"decimal",nullable:true})
  price:number
  @Column({type:'decimal',nullable:true})
  discount:number
  @Column({default:false})
  active_discount:boolean
  @Column()
  productId:number
  @ManyToOne(()=>ProductEnitiy,product=>product.size,{onDelete:'CASCADE'})
  product:ProductEnitiy
  


}