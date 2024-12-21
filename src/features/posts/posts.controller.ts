import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { GetAllPostsQuery } from './usecases/queries/get-all-posts.query'
import { RolesGuard } from '../../infrastructure/guards/roles.guard'
import { PostInputModel } from './posts.models'
import { AddPostCommand } from './usecases/commands/add-post.command'
import { GetPostByIdQuery } from './usecases/queries/get-post-by-id.query'
import { UpdatePostCommand } from './usecases/commands/update-post.command'
import { DeletePostCommand } from './usecases/commands/delete-post.command'

export interface GetAllPostsQueryParams {
  theme?: string
  title?: string
  pageNumber?: number
  pageSize?: number
}

@Controller('posts')
export class PostsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(200)
  async getAllPosts(
    @Query()
    { theme, pageNumber, pageSize }: GetAllPostsQueryParams,
  ) {
    const query = new GetAllPostsQuery(theme, pageNumber, pageSize)
    const {
      statusCode,
      error,
      data: posts,
    } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return posts
  }

  @Get(':id')
  @HttpCode(200)
  async getPostById(@Param('id') postId: string) {
    const query = new GetPostByIdQuery(postId)
    const { statusCode, error, data: post } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return post
  }

  @Post()
  @HttpCode(201)
  @UseGuards(RolesGuard)
  async addProduct(@Body() post: PostInputModel) {
    const command = new AddPostCommand(post)
    const {
      statusCode: code1,
      error: err1,
      data: createdPostId,
    } = await this.commandBus.execute(command)
    handleExceptions(code1, err1)

    const query = new GetPostByIdQuery(createdPostId)
    const {
      statusCode: code2,
      error: err2,
      data: createdPost,
    } = await this.queryBus.execute(query)
    handleExceptions(code2, err2)
    return createdPost
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') postId: string, @Body() post: PostInputModel) {
    const command = new UpdatePostCommand(postId, post)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') postId: string) {
    const command = new DeletePostCommand(postId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
