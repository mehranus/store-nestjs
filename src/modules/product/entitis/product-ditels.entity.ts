import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ProductEnitiy } from "./product.entity";


@Entity(EntityName.ProductDitels)
export class ProductDitelsEnitiy{
  @PrimaryGeneratedColumn("increment")
  id:number
  @Column()
  key:string
  @Column()
  value:string
  @Column()
  productId:number
  @ManyToOne(()=>ProductEnitiy,product=>product.ditels,{onDelete:'CASCADE'})
  product:ProductEnitiy
  


}