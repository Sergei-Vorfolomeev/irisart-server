import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ProductInputModel } from './dto/product.input.model'
import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { handleExceptions } from '../../base/utils/handle-exceptions'
import { AddProductCommand } from './usecases/commands/add-product.command'
import { GetProductByIdQuery } from './usecases/queries/get-product-by-id.query'
import { GetAllProductsQuery } from './usecases/queries/get-all-products.query'
import { GetAllProductsQueryParams } from './dto/get-all-products-query-params'
import { DeleteProductCommand } from './usecases/commands/delete-product.command'
import { UpdateProductCommand } from './usecases/commands/update-product.command'
import { RolesGuard } from '../../infrastructure/guards/roles.guard'

@Controller('products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @HttpCode(200)
  async getAllProducts(
    @Query()
    {
      term,
      category,
      pageNumber,
      pageSize,
      inStock,
    }: GetAllProductsQueryParams,
  ) {
    const query = new GetAllProductsQuery(
      term,
      category,
      pageNumber,
      pageSize,
      inStock,
    )
    const {
      statusCode,
      error,
      data: products,
    } = await this.queryBus.execute(query)
    handleExceptions(statusCode, error)
    return products
  }

  @Post()
  @HttpCode(201)
  @UseGuards(RolesGuard)
  async addProduct(@Body() product: ProductInputModel) {
    const command = new AddProductCommand(product)
    const {
      statusCode: code1,
      error: err1,
      data: createdProductId,
    } = await this.commandBus.execute(command)
    handleExceptions(code1, err1)

    const query = new GetProductByIdQuery(createdProductId)
    const {
      statusCode: code2,
      error: err2,
      data: createdProduct,
    } = await this.queryBus.execute(query)
    handleExceptions(code2, err2)
    return createdProduct
  }

  @Put(':id')
  @HttpCode(204)
  async updateProduct(
    @Param('id') productId: string,
    @Body() product: ProductInputModel,
  ) {
    const command = new UpdateProductCommand(productId, product)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') productId: string) {
    const command = new DeleteProductCommand(productId)
    const { statusCode, error } = await this.commandBus.execute(command)
    handleExceptions(statusCode, error)
  }
}
