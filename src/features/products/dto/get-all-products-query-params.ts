import { ProductsCategory } from '../types/products-type.enum'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'
import { IsBoolean, IsEnum, IsInt, IsOptional } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class GetAllProductsQueryParams {
  @IsValidString()
  @IsOptional()
  term?: string

  @IsEnum(ProductsCategory)
  @IsOptional()
  category?: ProductsCategory

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageSize?: number

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  pageNumber?: number

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  inStock?: boolean
}
