import { Controller, Post, Get, Body, Param, UseGuards } from '@nestjs/common';
import { ReactionService } from './reaction.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { getUser } from '../decorator';
import { ReactPostDto } from './dtos/react-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('reaction')
export class ReactionController {
    constructor(private reactService: ReactionService) {}

    @Post('reactPost')
    async reactPost(
        @getUser() userId: number,
        @Body() reactPostDto: ReactPostDto,
    ) {
        return await this.reactService.reactPost(userId, reactPostDto.postId);
    }

    @Get('getReactionsByPostId/:postId')
    async getReactionsByPostId(@Param() postId: number) {
        return await this.reactService.getReactionsByPostId(postId['postId']);
    }
}
