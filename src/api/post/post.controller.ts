import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Request } from 'express';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(AuthGuard())
  @Post()
  create(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postService.create(createPostDto, req['user'].id);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @UseGuards(AuthGuard())
  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
