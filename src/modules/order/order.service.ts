import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderEntity } from './entitis/order.entity';
import { Repository } from 'typeorm';
import { OrderStatus } from './enum/order.enum';
import { OrderDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository:Repository<OrderEntity>
  ){}

  async getAllOrderd(){
    return await this.orderRepository.find({
      where:{status:OrderStatus.Ordered}
    })
  }

  async findOneById(orderId:number){
    const order=await this.orderRepository.findOneBy({id:orderId})
    if(!order) throw new NotFoundException("Order Not Found!")
    return order
  }

  async setInProsses(orderDto:OrderDto){
    const {orderId}=orderDto
   const oder=await this.findOneById(orderId)
   if(oder.status !== OrderStatus.Ordered) throw new BadRequestException("Order is not  payment list")
    oder.status=OrderStatus.InProcess
  await this.orderRepository.save(oder)
  return {message:"order cheng status sucsesfully"}
  }

  async setPaket(orderDto:OrderDto){
    const {orderId}=orderDto
   const oder=await this.findOneById(orderId)
   if(oder.status !== OrderStatus.InProcess) throw new BadRequestException("Order is not  process list")
    oder.status=OrderStatus.Packed
  await this.orderRepository.save(oder)
  return {message:"order cheng status sucsesfully"}
  }

  async setTransit(orderDto:OrderDto){
    const {orderId}=orderDto
   const oder=await this.findOneById(orderId)
   if(oder.status !== OrderStatus.Packed) throw new BadRequestException("Order is not  packed list")
    oder.status=OrderStatus.InTransit
  await this.orderRepository.save(oder)
  return {message:"order cheng status sucsesfully"}
  }

  async setDeleverd(orderDto:OrderDto){
    const {orderId}=orderDto
   const oder=await this.findOneById(orderId)
   if(oder.status !== OrderStatus.InTransit) throw new BadRequestException("Order is not  Intransit list")
    oder.status=OrderStatus.Delivered
  await this.orderRepository.save(oder)
  return {message:"order cheng status sucsesfully"}
  }
  async setCansel( orderDto:OrderDto){
    const {orderId}=orderDto
   const oder=await this.findOneById(orderId)
   if(oder.status === OrderStatus.Canceled || oder.status === OrderStatus.Pending) throw new BadRequestException("Order not cheng status to cansel")
    oder.status=OrderStatus.Canceled
  await this.orderRepository.save(oder)
  return {message:" cheng status order to cansel sucsesfully"}
  }
}
