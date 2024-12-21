import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Post } from '../post.entity'
import { PostDbModel } from '../posts.models'

export class PostsRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsOrmRepo: Repository<Post>,
  ) {}

  async getById(postId: string): Promise<Post | null> {
    try {
      return await this.postsOrmRepo.findOne({
        where: {
          id: postId,
        },
      })
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async savePost(product: PostDbModel): Promise<Post | null> {
    try {
      return await this.postsOrmRepo.save(product)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async deletePost(postId: string): Promise<boolean> {
    try {
      const res = await this.postsOrmRepo.delete(postId)
      return res.affected === 1
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
