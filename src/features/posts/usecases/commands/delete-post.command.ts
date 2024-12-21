import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { PostsRepository } from '../../repositories/posts.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'

export class DeletePostCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostCommandHandler implements ICommandHandler {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ postId }: DeletePostCommand): Promise<InterLayerObject> {
    const isDeleted = await this.postsRepository.deletePost(postId)
    if (!isDeleted) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Ошибка удаления поста. Пост не существует или удаление не удалось',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
