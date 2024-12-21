import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { PostDbModel, PostInputModel } from '../../posts.models'
import { PostsRepository } from '../../repositories/posts.repository'

export class AddPostCommand {
  constructor(public post: PostInputModel) {}
}

@CommandHandler(AddPostCommand)
export class AddPostCommandHandler implements ICommandHandler {
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute({ post }: AddPostCommand): Promise<InterLayerObject<string>> {
    const { title, description, content, theme, image } = post
    const newPost: PostDbModel = {
      title,
      description,
      content,
      theme,
      image,
    }
    const createdPost = await this.postsRepository.savePost(newPost)
    if (!createdPost) {
      return new InterLayerObject(
        StatusCode.ServerError,
        `Ошибка создания поста ${title}`,
      )
    }
    return new InterLayerObject(StatusCode.Created, null, createdPost.id)
  }
}
