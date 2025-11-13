import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('payments')
@Controller('payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment' })
  create(@Body() createPaymentDto: CreatePaymentDto, @CurrentUser() user: any) {
    return this.paymentService.create(createPaymentDto, user.userId, user.companyId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  findAll(@CurrentUser() user: any) {
    if (user.role === 'CUSTOMER') {
      return this.paymentService.findAll(user.companyId, user.userId);
    }
    return this.paymentService.findAll(user.companyId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify Razorpay payment' })
  verify(
    @Param('id') id: string,
    @Body('razorpayPaymentId') razorpayPaymentId: string,
    @Body('razorpaySignature') razorpaySignature: string,
  ) {
    return this.paymentService.verifyPayment(id, razorpayPaymentId, razorpaySignature);
  }
}

