import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderStatus } from "../enum/order.enum";
import { OredrItemEntity } from "./order-item.entity";
import { PaymentEntity } from "src/modules/payment/entity/pament.entity";
import { UserAdressEntity } from "src/modules/user/entity/addres.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";


@Entity(EntityName.Order)
export class OrderEntity{
  @PrimaryGeneratedColumn('increment')
  id:number
  @Column({type:'enum',enum:OrderStatus,default:OrderStatus.Pending})
  status:string
  @Column()
  final_amount:number
  @Column()
  discount_amount:number
  @Column()
  total_amount:number
  @Column({nullable:true})
  paymentId:number
  @Column({nullable:true})
  addresId:number
  @Column({nullable:true})
  userId:number

  @CreateDateColumn()
  created_at:Date

        @ManyToOne(()=>UserAdressEntity,addres=>addres.orders,{onDelete:'SET NULL'})
        addres:UserAdressEntity
        @OneToMany(()=>OredrItemEntity,item=>item.order,{onDelete:'CASCADE'})
        item:OredrItemEntity[]
        @OneToOne(()=>PaymentEntity,payment=>payment.order,{onDelete:'SET NULL'})
        @JoinColumn({name:'paymentId'})
        payment:PaymentEntity
        @ManyToOne(()=>UserEntity,user=>user.orders,{onDelete:"CASCADE"})
        user:UserEntity


}