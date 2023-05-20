import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
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

    @Get('getOrders')
    async getOrders() {
        return this.orderService.getOrders();
    }

    @Get('getOrderById/:id')
    async getOrderById(@Param() orderId: number) {
        return this.orderService.getOrderById(orderId['id']);
    }
}
