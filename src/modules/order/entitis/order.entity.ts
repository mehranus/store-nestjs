import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order.enum";

@Entity(EntityName.Order)
export class OrderEntity{
  @PrimaryGeneratedColumn('increment')
  id:number
  @Column({type:'enum',enum:OrderStatus,default:OrderStatus.Pending})
  status:string
  @Column()
  address:string
  @Column()
  final_amount:number
  @Column()
  discount_amount:number
  @Column()
  total_amount:number
  @Column({nullable:true})
  paymentId:number

  @CreateDateColumn()
  created_at:Date


}