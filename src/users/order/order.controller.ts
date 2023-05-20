import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { getUser } from '../decorator';
import { JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post('createOrder')
    async createOrder(@getUser() user: any, @Body() productIds: Array<number>) {
        const userId = user.userId;
        return this.orderService.createOrder(userId, productIds);
    }
}
