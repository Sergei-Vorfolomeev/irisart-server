import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { UsersRepository } from '../../repositories/users.repository'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'

export class UnbanUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(UnbanUserCommand)
export class UnbanUserCommandHandler implements ICommandHandler {
  constructor(private readonly usersRepository: UsersRepository) {}

  async execute(command: UnbanUserCommand): Promise<InterLayerObject> {
    debugger
    const bannedUser = await this.usersRepository.getBannedUserById(
      command.userId,
    )
    if (!bannedUser) {
      return new InterLayerObject(
        StatusCode.NotFound,
        'Заблокированный пользователь с текущим id не найден',
      )
    }
    const isUnbanned = await this.usersRepository.unbanUser(command.userId)
    if (!isUnbanned) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка разблокировки пользователя',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
