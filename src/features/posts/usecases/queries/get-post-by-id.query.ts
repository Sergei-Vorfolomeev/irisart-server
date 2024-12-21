import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { PostsQueryRepository } from '../../repositories/posts.query.repository'
import { PostViewModel } from './get-all-posts.query'

export class GetPostByIdQuery {
  constructor(public postId: string) {}
}

@QueryHandler(GetPostByIdQuery)
export class GetPostByIdQueryHandler implements IQueryHandler {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute({
    postId,
  }: GetPostByIdQuery): Promise<InterLayerObject<PostViewModel>> {
    const post = await this.postsQueryRepository.getById(postId)

    if (!post) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Пост c текущим id не найден',
      )
    }

    return new InterLayerObject<PostViewModel>(StatusCode.Success, null, post)
  }
}
