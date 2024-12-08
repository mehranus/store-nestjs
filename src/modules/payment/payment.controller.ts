import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AddressDto } from './dto/payment.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';
import { Response } from 'express';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  create(@Body() addressDto:AddressDto){
    return this.paymentService.create(addressDto)
  }

  @Get()
  async verifay(@Query("Authority") authority:string,@Query('Status') status:string, @Res() res:Response){
    const url=await this.paymentService.verify(authority,status)
    return res.redirect(url)
  }

  @Get()
  find(){
    return this.paymentService.find()
  }
}
