

import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { EntityName } from "src/common/enum/entity-name.enum";

@Entity(EntityName.Otp)
export class OtpEntity {
   @PrimaryGeneratedColumn('increment')
   id:number
   @Column()
   code:string
   @Column()
   expiresIn:Date
   @Column()
   userId:number
   @OneToOne(()=>UserEntity,(user)=>user.otp,{onDelete:"CASCADE"})
   user:UserEntity
   
   
}