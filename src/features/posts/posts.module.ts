import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CqrsModule } from '@nestjs/cqrs'
import { PostsQueryRepository } from './repositories/posts.query.repository'
import { PostsController } from './posts.controller'
import { Post } from './post.entity'
import { GetAllPostsQueryHandler } from './usecases/queries/get-all-posts.query'
import { AddPostCommandHandler } from './usecases/commands/add-post.command'
import { GetPostByIdQueryHandler } from './usecases/queries/get-post-by-id.query'
import { PostsRepository } from './repositories/posts.repository'
import { UpdatePostCommandHandler } from './usecases/commands/update-post.command'
import { DeletePostCommandHandler } from './usecases/commands/delete-post.command'

const postsUseCases = [
  GetAllPostsQueryHandler,
  GetPostByIdQueryHandler,
  AddPostCommandHandler,
  UpdatePostCommandHandler,
  DeletePostCommandHandler,
]

@Module({
  imports: [TypeOrmModule.forFeature([Post]), CqrsModule],
  controllers: [PostsController],
  providers: [...postsUseCases, PostsQueryRepository, PostsRepository],
  exports: [],
})
export class PostsModule {}
