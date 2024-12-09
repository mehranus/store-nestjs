
import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { OrderEntity } from "src/modules/order/entitis/order.entity";



@Entity(EntityName.UserAdress)
export class UserAdressEntity{
  @PrimaryGeneratedColumn('increment')
  id:number
  @Column()
  title:string
  @Column()
  province:string
  @Column()
  city:string
  @Column()
  address:string
  @Column({nullable:true})
  postal_code:string
  
  @CreateDateColumn()
  created_at:Date
  @Column()
  userId:number

          @ManyToOne(()=>UserEntity,(user)=>user.addressList,{onDelete:'CASCADE'})
          user:UserEntity

          @OneToMany(()=>OrderEntity,(order)=>order.addres)
          orders:OrderEntity[]
}