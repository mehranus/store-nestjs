import { Body, Controller, Get, Put } from '@nestjs/common';
import { OrderService } from './order.service';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';
import { OrderDto } from './dto/order.dto';

@Controller('order')
@ApiTags('Order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  getAll(){
    return this.orderService.getAllOrderd()
  }

  @Put("set-in-prosses")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  setInProsses(@Body() orderDto:OrderDto){
    return this.orderService.setInProsses(orderDto)
  }
  
  @Put("paket")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  setPaket(@Body() orderDto:OrderDto){
    return this.orderService.setPaket(orderDto)
  }

  @Put("in-transit")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  setInTransit(@Body() orderDto:OrderDto){
    return this.orderService.setTransit(orderDto)
  }

  @Put("delever")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  setDelever(@Body() orderDto:OrderDto){
    return this.orderService.setDeleverd(orderDto)
  }

  @Put("cansel")
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  setCansel(@Body() orderDto:OrderDto){
    return this.orderService.setCansel(orderDto)
  }
}
