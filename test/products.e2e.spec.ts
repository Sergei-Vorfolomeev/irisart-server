import { INestApplication } from '@nestjs/common'
import { initTestSettings } from './utils/init-test-settings'
import { dropDb } from './utils/drop-db'
import { ProductsModule } from '../src/features/products/products.module'
import * as request from 'supertest'
import { PATHS } from '../src/base/const/paths'
import { JwtModule } from '../src/base/adapters/jwt/jwt.module'
import { ProductTestHelper } from './utils/product-test.helper'
import { UserTestHelper } from './utils/user-test.helper'
import { Roles } from '../src/features/users/types/roles.enum'
import { ProductsCategory } from '../src/features/products/types/products-type.enum'

describe('ProductsController (e2e)', () => {
  let app: INestApplication
  let httpServer: any

  const userTestHelper = new UserTestHelper()
  const productTestHelper = new ProductTestHelper()

  beforeAll(async () => {
    const res = await initTestSettings(
      app,
      httpServer,
      ProductsModule,
      JwtModule,
    )
    app = res.app
    httpServer = res.httpServer
  })

  afterAll(async () => {
    await dropDb(app)
    await app.close()
  })

  it('get all products', async () => {
    const { body } = await request(httpServer).get(PATHS.products).expect(200)

    expect(body).toEqual({
      items: [],
      pagesCount: 1,
      page: 1,
      pageSize: 10,
      totalCount: 0,
    })
  })

  let user: any
  let accessToken: string
  it('create and login user', async () => {
    const res = await userTestHelper.createAndLoginUser(httpServer, Roles.admin)
    user = res.user
    accessToken = res.accessToken

    expect(user).toEqual({
      id: expect.any(String),
      userName: 'test',
      email: 'test@gmail.com',
      role: 'admin',
      createdAt: expect.any(String),
      banStatus: expect.any(Boolean),
    })
  })

  it('add product', async () => {
    const { body } = await request(httpServer)
      .post(PATHS.products)
      .set('Cookie', `accessToken=${accessToken}`)
      .send({
        name: 'product',
        description: `description`,
        category: ProductsCategory.painting,
        inStock: true,
        price: 50,
      })
      .expect(201)

    expect(body).toEqual({
      id: expect.any(String),
      name: 'product',
      description: `description`,
      category: ProductsCategory.painting,
      inStock: true,
      price: 50,
      createdAt: expect.any(String),
    })
  })
})
