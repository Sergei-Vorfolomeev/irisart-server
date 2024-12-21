import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PostDbModel, PostInputModel } from '../../posts.models'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { PostsRepository } from '../../repositories/posts.repository'

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public post: PostInputModel,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostCommandHandler implements ICommandHandler {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({
    postId,
    post,
  }: UpdatePostCommand): Promise<InterLayerObject> {
    const { title, description, content, theme, image } = post

    const existedPost = await this.postsRepository.getById(postId)
    if (!existedPost) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Пост с указанным id не найден',
      )
    }

    const editedPost: PostDbModel = {
      ...existedPost,
      title,
      description,
      content,
      theme,
      image,
    }
    const updatedPost = await this.postsRepository.savePost(editedPost)
    if (!updatedPost) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка обновления поста',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
