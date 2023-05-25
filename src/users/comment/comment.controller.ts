import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from 'src/auth/guard';
import { getUser } from '../decorator';
import { CommentPostDto } from './dtos/comment-post.dto';
import { UpdateCommentDto } from './dtos/update-comment.dto';

@UseGuards(JwtAuthGuard)
@Controller('comment')
export class CommentController {
    constructor(private commentService: CommentService) {}

    @Post('commentPost')
    async commentPost(
        @getUser() userId: number,
        @Body() commentPostDto: CommentPostDto,
    ) {
        return await this.commentService.commentPost(userId, commentPostDto);
    }

    @Post('updateComment')
    async updateComment(
        @getUser() userId: number,
        @Body() updateCommentDto: UpdateCommentDto,
    ) {
        return await this.commentService.updateComment(
            userId,
            updateCommentDto,
        );
    }

    @Post('deleteComment/:commentId')
    async deleteComment(@getUser() userId: number, @Param() commentId: number) {
        return await this.commentService.deleteComment(
            userId,
            commentId['commentId'],
        );
    }

    @Get('getCommentsByPostId/:postId')
    async getCommentsbyPostId(@Param() postId: number) {
        return this.commentService.getCommentsbyPostId(postId['postId']);
    }
}
