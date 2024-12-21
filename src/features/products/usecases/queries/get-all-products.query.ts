import { IQueryHandler, QueryHandler } from '@nestjs/cqrs'
import { ProductsQueryRepository } from '../../repositories/products.query.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { ProductViewModel } from '../../dto/product.view.model'
import { ProductsCategory } from '../../types/products-type.enum'
import { Paginator } from '../../../../base/paginator.type'

export class GetAllProductsQuery {
  constructor(
    public term?: string,
    public category?: ProductsCategory,
    public pageNumber?: number,
    public pageSize?: number,
    public inStock?: boolean,
  ) {}
}

@QueryHandler(GetAllProductsQuery)
export class GetAllProductsQueryHandler implements IQueryHandler {
  constructor(
    private readonly productsQueryRepository: ProductsQueryRepository,
  ) {}

  async execute(
    queryParams: GetAllProductsQuery,
  ): Promise<InterLayerObject<Paginator<ProductViewModel[]>>> {
    const products = await this.productsQueryRepository.getAll(queryParams)
    if (!products) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка запроса товаров',
      )
    }
    return new InterLayerObject<Paginator<ProductViewModel[]>>(
      StatusCode.Success,
      null,
      products,
    )
  }
}
