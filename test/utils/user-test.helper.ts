import * as request from 'supertest'
import { PATHS } from '../../src/base/const/paths'
import { Roles } from '../../src/features/users/types/roles.enum'

export class UserTestHelper {
  async createUser(httpServer: any, role: Roles, credentials?: string) {
    const res = await request(httpServer)
      .post(PATHS.users)
      // .set('Authorization', `Basic ${credentials}`)
      .send({
        userName: 'test',
        email: 'test@gmail.com',
        password: 'test-pass',
        role,
      })
      .expect(201)
    return res.body
  }

  // async createManyUsers(httpServer: any, count: number, credentials: string) {
  //   const users = []
  //   for (let i = 0; i < count; i++) {
  //     try {
  //       const res = await request(httpServer)
  //         .post(PATHS.users)
  //         // .set('Authorization', `Basic ${credentials}`)
  //         .send({
  //           userName: `userName#${i}`,
  //           email: `test-${i}-@gmail.com`,
  //           password: `test-pass`,
  //         })
  //         .expect(201)
  //       users.push(res.body)
  //     } catch (e) {
  //       console.error(e)
  //     }
  //   }
  //   return users.reverse()
  // }

  async registerUser(httpServer: any) {
    const i = Math.ceil(Math.random() * 1000)
    await request(httpServer)
      .post(`${PATHS.auth}/sign-up`)
      .send({
        userName: `userName#${i}`,
        email: `email${i}@gmail.com`,
        password: 'test-pass',
      })
      .expect(204)
    return {
      userName: `userName#${i}`,
      email: `email${i}@gmail.com`,
      password: 'test-pass',
    }
  }

  async signInUser(httpServer: any, email: string, password: string) {
    const { headers } = await request(httpServer)
      .post(`${PATHS.auth}/sign-in`)
      .send({
        email,
        password,
      })
      .expect(200)

    const cookieHeader = headers['set-cookie']
    const accessToken = cookieHeader[0].split(';')[0].split('=')[1]
    const refreshToken = cookieHeader[1].split(';')[0].split('=')[1]
    expect(accessToken).toEqual(expect.any(String))
    expect(accessToken).toContain('.')
    expect(refreshToken).toEqual(expect.any(String))
    expect(refreshToken).toContain('.')

    return { accessToken, refreshToken }
  }

  async createAndLoginUser(httpServer: any, role: Roles) {
    debugger
    const user = await this.createUser(httpServer, role)
    const { accessToken, refreshToken } = await this.signInUser(
      httpServer,
      user.email,
      'test-pass',
    )
    return { user, accessToken, refreshToken }
  }

  //
  // async meRequest(httpServer: any, token: string) {
  //   const res = await request(httpServer)
  //     .get(`${PATHS.auth}/me`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .expect(200)
  //
  //   return res.body
  // }
}
