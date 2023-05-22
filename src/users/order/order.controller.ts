import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { OrderService } from './order.service';
import { getUser } from '../decorator';
import { JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
    constructor(private orderService: OrderService) {}

    @Post('createOrder')
    async createOrder(
        @getUser() userId: number,
        @Body() productIds: Array<number>,
    ) {
        return this.orderService.createOrder(userId, productIds);
    }

    @Get('getOrders')
    async getOrders() {
        return this.orderService.getOrders();
    }

    @Get('getOrdersByUser')
    async getOrdersByUser(@getUser() userId: number) {
        return this.orderService.getOrdersByUser(userId);
    }

    @Get('getOrderById/:id')
    async getOrderById(@Param() orderId: number) {
        return this.orderService.getOrderById(orderId['id']);
    }
}
