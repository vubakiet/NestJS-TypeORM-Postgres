import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';
import { getUser } from '../decorator';
import { CreateNotifyDto } from '../dtos/create-notifty.dto';

@UseGuards(JwtAuthGuard)
@Controller('notification')
export class NotificationController {
    constructor(private notificationService: NotificationService) {}

    @Roles(Role.USER, Role.ADMIN)
    @Post('createNotify')
    async createNotify(
        @getUser() userId: number,
        @Body() notify: CreateNotifyDto,
    ) {
        return this.notificationService.createNotify(userId, notify);
    }
}
