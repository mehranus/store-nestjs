import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AddressDto } from './dto/payment.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { TypeData } from 'src/common/enum/type-data.enum';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiConsumes(TypeData.UrlEncoded,TypeData.Json)
  create(@Body() addressDto:AddressDto){
    return this.paymentService.create(addressDto)
  }
}
