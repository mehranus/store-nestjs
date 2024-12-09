import { EntityName } from "src/common/enum/entity-name.enum";
import { OrderEntity } from "src/modules/order/entitis/order.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity(EntityName.Payment)
export class PaymentEntity{
  @PrimaryGeneratedColumn('increment')
  id:number
  @Column()
  amount:number
  @Column()
  status:boolean
  @Column({unique:true})
  invoice_number:string
  @Column({nullable:true})
  refId:string
  @Column({nullable:true})
  authority:string
  
  @Column()
  odrerId:number
  @Column()
  userId:number
  @CreateDateColumn()
  created_at:Date

    @OneToOne(()=>OrderEntity,order=>order.payment,{onUpdate:'CASCADE'})
    order:OrderEntity
    @ManyToOne(()=>UserEntity,user=>user.payment,{onDelete:"CASCADE"})
    user:UserEntity
}