import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { DiscountType } from "../enum/discount.enum";

@Entity(EntityName.Discount)
export class DiscountEntity{
  @PrimaryGeneratedColumn("increment")
  id:number
  @Column({unique:true})
  code:string;
  
  @Column({type:'decimal' , nullable:true})
  percent:number;

  @Column({type:'decimal' , nullable:true})
  amount:number;

  @Column({type:'timestamp',nullable:true})
  expierIn:Date

  @Column({nullable:true})
  limit:number

  @Column({nullable:true,default:1})
  usage:number

  @Column({nullable:true})
  productId:number

  @Column({default:false})
  active:boolean

  @Column({type:'enum',enum:DiscountType})
  type:string

}