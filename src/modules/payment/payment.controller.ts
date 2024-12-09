import { Body, Controller, Get, Post, Query, Res, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AddressDto } from './dto/payment.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';
import { Response } from 'express';
import { UserAuth } from 'src/common/decorators/auth.decorator';

@Controller('payment')
@ApiTags('Payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @UserAuth()
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
