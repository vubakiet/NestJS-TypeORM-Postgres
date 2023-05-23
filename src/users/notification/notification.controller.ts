import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    DefaultValuePipe,
    ParseIntPipe,
    Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { Roles } from 'src/auth/decorator';
import { Role } from 'src/auth/enum';
import { getUser } from '../decorator';
import { CreateNotifyDto } from '../dtos/create-notifty.dto';
import {
    IPaginationOptions,
    Pagination,
    paginate,
} from 'nestjs-typeorm-paginate';
import { NotificationEntity } from 'src/entities/notification.entity';
import { AllPaginationsDto } from './dtos/all-paginations.dto';
import { PaginationByIdDto } from './dtos/pagination-by-id.dto';

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
        return await this.notificationService.createNotify(userId, notify);
    }

    @Roles(Role.USER, Role.ADMIN)
    @Get('getNotifications')
    async getNotifications(@getUser() userId: number) {
        return await this.notificationService.getNotifications(userId);
    }

    @Get('getPaginationNotifications')
    async getPaginationNotifications(
        // @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        // @Query('limit', new DefaultValuePipe(2), ParseIntPipe)
        // limit: number = 2,
        @Body() allPaginationsDto: AllPaginationsDto,
    ): Promise<Pagination<NotificationEntity>> {
        const { limit, page } = allPaginationsDto;

        return this.notificationService.getPaginationNotifications({
            page,
            limit,
        });
    }

    @Get('getNofiticationsPaginate')
    async getNofiticationsPaginate(
        @Body() allPaginationsDto: AllPaginationsDto,
    ) {
        return this.notificationService.getNofiticationsPaginate(
            allPaginationsDto,
        );
    }

    @Get('getNotificationById')
    async getNotificationById(@Body() paginationsByIdDto: PaginationByIdDto) {
        return this.notificationService.getNotificationById(paginationsByIdDto);
    }
}
