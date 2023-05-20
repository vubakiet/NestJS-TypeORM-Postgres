import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { getUser } from './decorator';
import { AuthGuard, JwtAuthGuard } from 'src/auth/guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    // @UseGuards(AuthGuard)
    // @Get('getUsers')
    // async getUsers(@Req() req: Request) {
    //     return await this.usersService.getUsers();
    // }

    @Get('getMe')
    async getMe(@getUser() user: any) {
        return this.usersService.getMe(user.userId);
    }

    // @UseGuards(JwtAuthGuard)
    // @Post('createOrder')
    // async createOrder(@getUser() user: any, @Body() productIds: Array<number>) {
    //     const userId = user.userId;
    //     return await this.usersService.createOrder(userId, productIds);
    // }
}
