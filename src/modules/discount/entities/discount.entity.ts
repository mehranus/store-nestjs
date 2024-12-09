import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { DiscountType } from "../enum/discount.enum";
import { BasketEntity } from "src/modules/basket/entitis/basket.entity";
import { UserEntity } from "src/modules/user/entity/user.entity";

@Entity(EntityName.Discount)
export class DiscountEntity {
  @PrimaryGeneratedColumn("increment")
  id: number;
  @Column({ unique: true })
  code: string;
  @Column({ type: "decimal", nullable: true })
  percent: number;
  @Column({ type: "decimal", nullable: true })
  amount: number;
  @Column({ type: "timestamp", nullable: true })
  expierIn: Date;
  @Column({ nullable: true })
  limit: number;
  @Column({ nullable: true, default: 1 })
  usage: number;
  @Column({ nullable: true })
  productId: number;
  @Column({ nullable: true })
  userId: number;
  @Column({ default: false })
  active: boolean;
  @Column({ type: "enum", enum: DiscountType })
  type: string;

      @OneToMany(() => BasketEntity, (basket) => basket.discount)
      basket: BasketEntity[];
      @ManyToOne(()=>UserEntity,user=>user.discount,{onDelete:'CASCADE'})
      user:UserEntity
}
