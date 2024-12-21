import { PATHS } from '../../src/base/const/paths'
import * as request from 'supertest'
import { ProductsCategory } from '../../src/features/products/types/products-type.enum'

export class ProductTestHelper {
  addProduct(httpServer: any, accessToken: string) {
    request(httpServer)
      .post(PATHS.products)
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        name: 'product',
        description: `description`,
        category: Math.round(Math.random())
          ? ProductsCategory.painting
          : ProductsCategory.ceramics,
        inStock: Boolean(Math.round(Math.random())),
        price: Math.ceil(Math.random() * 1000),
      })
  }

  addManyProduct(count: number, httpServer: any, accessToken: string) {
    for (let i = 0; i < count; i++) {
      request(httpServer)
        .post(PATHS.products)
        .set('Cookie', `accessToken=${accessToken}`)
        .send({
          name: `product#${i}`,
          description: `description#${i}`,
          category:
            i % 2 === 0 ? ProductsCategory.ceramics : ProductsCategory.painting,
          inStock: i % 2 === 0,
          price: Math.ceil(Math.random() * 1000),
        })
        .expect(201)
    }
  }
}
