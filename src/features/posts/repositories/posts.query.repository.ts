import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { GetAllPostsQueryParams } from '../posts.controller'
import { Paginator } from '../../../base/paginator.type'
import { Post } from '../post.entity'
import { PostViewModel } from '../posts.models'

export class PostsQueryRepository {
  constructor(
    @InjectRepository(Post)
    private readonly postsOrmRepo: Repository<Post>,
  ) {}

  async getAll({
    theme,
    title,
    pageSize = 10,
    pageNumber = 1,
  }: GetAllPostsQueryParams): Promise<Paginator<PostViewModel[]> | null> {
    try {
      const whereCondition: Record<string, any> = {}
      if (title) {
        whereCondition.title = ILike(`%${title}%`)
      }
      if (theme) {
        whereCondition.theme = theme
      }

      const [posts, total] = await this.postsOrmRepo.findAndCount({
        where: whereCondition,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        order: {
          created_at: 'DESC',
        },
      })

      const pagesCount = total === 0 ? 1 : Math.ceil(total / pageSize)

      return {
        items: posts.map(this.mapToView),
        page: pageNumber,
        pageSize: pageSize,
        pagesCount: pagesCount,
        totalCount: total,
      }
    } catch (e) {
      console.error(e)
      return null
    }
  }

  async getById(id: string): Promise<PostViewModel | null> {
    try {
      const post = await this.postsOrmRepo.findOne({
        where: {
          id,
        },
      })
      if (!post) {
        return null
      }
      return this.mapToView(post)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  mapToView = (post: Post): PostViewModel => ({
    id: post.id,
    title: post.title,
    description: post.description,
    content: post.content,
    createdAt: post.created_at,
    updatedAt: post.updated_at,
  })
}
