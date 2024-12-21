import { ProductViewModel } from '../dto/product.view.model'
import { Product } from '../product.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { ILike, Repository } from 'typeorm'
import { GetAllProductsQueryParams } from '../dto/get-all-products-query-params'
import { Paginator } from '../../../base/paginator.type'

export class ProductsQueryRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productsOrmRepo: Repository<Product>,
  ) {}

  async getAll({
    term = '',
    category,
    pageSize = 10,
    pageNumber = 1,
    inStock,
  }: GetAllProductsQueryParams): Promise<Paginator<ProductViewModel[]> | null> {
    try {
      const whereCondition: any = {
        name: ILike(`%${term}%`),
      }

      if (category) {
        whereCondition.category = category
      }
      if (inStock !== undefined) {
        whereCondition.inStock = inStock
      }

      const [products, total] = await this.productsOrmRepo.findAndCount({
        where: whereCondition,
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        order: {
          created_at: 'DESC',
        },
      })

      const pagesCount = total === 0 ? 1 : Math.ceil(total / pageSize)

      return {
        items: products.map(this.mapToView),
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

  async getById(id: string): Promise<ProductViewModel | null> {
    try {
      const product = await this.productsOrmRepo.findOne({
        where: {
          id,
        },
      })
      if (!product) {
        return null
      }
      return this.mapToView(product)
    } catch (e) {
      console.error(e)
      return null
    }
  }

  mapToView(product: Product): ProductViewModel {
    return {
      id: product.id,
      category: product.category,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      inStock: product.inStock,
      createdAt: product.created_at,
      updatedAt: product.updated_at,
    }
  }
}
