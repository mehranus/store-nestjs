import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductEnitiy } from "./product.entity";
import { BasketEntity } from "src/modules/basket/entitis/basket.entity";


@Entity(EntityName.ProductColor)
export class ProductColorEnitiy{
  @PrimaryGeneratedColumn("increment")
  id:number
  @Column()
  color_name:string
  @Column()
  color_code:string
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
  @ManyToOne(()=>ProductEnitiy,product=>product.color,{onDelete:'CASCADE'})
  product:ProductEnitiy

  @OneToMany(()=>BasketEntity,basket=>basket.color)
  basket:BasketEntity[]
  


}