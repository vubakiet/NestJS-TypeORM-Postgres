import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { getUser } from '../decorator';
import { CreatePostDto } from './dtos/create-post.dto';
import { JwtAuthGuard } from 'src/auth/guard';
import { UpdatePostDto } from './dtos/update-post.dto';

@UseGuards(JwtAuthGuard)
@Controller('post')
export class PostController {
    constructor(private postService: PostService) {}

    @Get('getPosts')
    async getPosts() {
        return this.postService.getPosts();
    }

    @Get('getPost/:postId')
    async getPostById(@Param() postId: number) {
        return this.postService.getPostById(postId['postId']);
    }

    @Post('createPost')
    async createPost(
        @getUser() userId: number,
        @Body() createPostDto: CreatePostDto,
    ) {
        return this.postService.createPost(userId, createPostDto);
    }

    @Post('updatePost/:postId')
    async updatePost(
        @getUser() userId: number,
        @Param() postId: number,
        @Body() updatePostDto: UpdatePostDto,
    ) {
        return this.postService.updatePost(
            userId,
            postId['postId'],
            updatePostDto,
        );
    }

    @Post('deletePost/:postId')
    async deletePost(@getUser() userId: number, @Param() postId: number) {
        return this.postService.deletePost(userId, postId['postId']);
    }
}
