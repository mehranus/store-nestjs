import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "../order/entitis/order.entity";

@Entity(EntityName.Payment)
export class PaymentEntity{
  @PrimaryGeneratedColumn('increment')
  id:number
  @Column()
  amount:number
  @Column()
  status:boolean
  @Column()
  invoice_number:string
  @Column({nullable:true})
  refId:string
  @Column({nullable:true})
  authority:string
  @Column()
  odrerId:number
  @CreateDateColumn()
  created_at:Date

  @OneToOne(()=>OrderEntity,order=>order.payment,{onUpdate:'CASCADE'})
  order:OrderEntity
}