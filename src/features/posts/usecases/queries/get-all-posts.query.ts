import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { Paginator } from '../../../../base/paginator.type'
import { PostsQueryRepository } from '../../repositories/posts.query.repository'
import { PostViewModel } from '../../posts.models'

export class GetAllPostsQuery {
  constructor(
    public theme?: string,
    public pageNumber?: number,
    public pageSize?: number,
  ) {}
}

@QueryHandler(GetAllPostsQuery)
export class GetAllPostsQueryHandler implements IQueryHandler {
  constructor(private readonly postsQueryRepository: PostsQueryRepository) {}

  async execute(
    queryParams: GetAllPostsQuery,
  ): Promise<InterLayerObject<Paginator<PostViewModel[]>>> {
    const posts = await this.postsQueryRepository.getAll(queryParams)
    if (!posts) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка запроса постов',
      )
    }
    return new InterLayerObject<Paginator<PostViewModel[]>>(
      StatusCode.Success,
      null,
      posts,
    )
  }
}
