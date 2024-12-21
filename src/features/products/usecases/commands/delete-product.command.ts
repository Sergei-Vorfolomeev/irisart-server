import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { ProductsRepository } from '../../repositories/products.repository'

export class DeleteProductCommand {
  constructor(public productId: string) {}
}

@CommandHandler(DeleteProductCommand)
export class DeleteProductCommandHandler implements ICommandHandler {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    productId,
  }: DeleteProductCommand): Promise<InterLayerObject> {
    // fixme этот запрос разве нужен?
    const product = await this.productsRepository.getById(productId)
    if (!product) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Продукт с текущим id не найден',
      )
    }
    const isDeleted = await this.productsRepository.deleteProduct(productId)
    if (!isDeleted) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка удаления продукта',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
