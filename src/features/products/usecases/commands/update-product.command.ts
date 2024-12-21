import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { ProductsRepository } from '../../repositories/products.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { ProductInputModel } from '../../dto/product.input.model'
import { ProductDbModel } from '../../types/product-db.model'

export class UpdateProductCommand {
  constructor(
    public productId: string,
    public product: ProductInputModel,
  ) {}
}

@CommandHandler(UpdateProductCommand)
export class UpdateProductCommandHandler implements ICommandHandler {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({
    productId,
    product,
  }: UpdateProductCommand): Promise<InterLayerObject> {
    const { name, description, category, price, image, inStock } = product

    const existedProduct = await this.productsRepository.getById(productId)
    if (!existedProduct) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Товар с указанным id не найден',
      )
    }

    const editedProduct: ProductDbModel = {
      ...existedProduct,
      name,
      description,
      category,
      price,
      image,
      inStock,
    }
    const updatedProduct =
      await this.productsRepository.saveProduct(editedProduct)
    if (!updatedProduct) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка обновления товара',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
