import { EntityName } from "src/common/enum/entity-name.enum";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";
import { ProductEnitiy } from "src/modules/product/entitis/product.entity";
import { ProductColorEnitiy } from "src/modules/product/entitis/product-color.entity";
import { ProductSizeEnitiy } from "src/modules/product/entitis/product-size.entity";

@Entity(EntityName.OrderItem)
export class OredrItemEntity{
  @PrimaryGeneratedColumn('increment')
  id:number
  @Column()
  orderId:number
  @Column()
  productId:number;
  @Column()
  sizeId:number
  @Column()
  colorId:number

      @ManyToOne(()=>OrderEntity,order=>order.item)
      order:OrderEntity
      @ManyToOne(()=>ProductEnitiy,pro=>pro.orders)
      product:ProductEnitiy
      @ManyToOne(()=>ProductColorEnitiy,color=>color.orders)
      color:ProductColorEnitiy
      @ManyToOne(()=>ProductSizeEnitiy,size=>size.orders)
      size:ProductSizeEnitiy
}