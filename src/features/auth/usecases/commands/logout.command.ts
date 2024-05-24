import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { JwtAdapter } from '../../../../base/adapters/jwt.adapter'
import { UsersRepository } from '../../../users/repositories/users.repository'

export class LogoutCommand {
  constructor(public refreshToken: string) {}
}

@CommandHandler(LogoutCommand)
export class LogoutCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtAdapter: JwtAdapter,
  ) {}

  async execute({ refreshToken }: LogoutCommand): Promise<InterLayerObject> {
    const user = await this.jwtAdapter.verifyRefreshToken(refreshToken)
    if (!user) {
      return new InterLayerObject(StatusCode.Unauthorized)
    }

    user.refreshToken = null
    const updatedUser = await this.usersRepository.save(user)
    if (!updatedUser || updatedUser.refreshToken) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }

    return new InterLayerObject(StatusCode.NoContent)
  }
}
