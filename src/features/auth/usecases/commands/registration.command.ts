import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import {
  InterLayerObject,
  StatusCode,
} from '../../../../base/interlayer-object'
import { UsersRepository } from '../../../users/repositories/users.repository'
import { Roles } from '../../../users/types/roles.enum'
import { BcryptAdapter } from '../../../../base/adapters/bcrypt.adapter'
import { EmailAdapter } from '../../../../base/adapters/email.adapter'
import { templateForRegistration } from '../../../../base/utils/template-for-registration'
import { randomUUID } from 'crypto'
import { add } from 'date-fns/add'
import { EmailConfirmation } from '../../../users/entities/email-confirmation'
import { User } from '../../../users/entities/user.entity'

export class RegistrationCommand {
  constructor(
    public login: string,
    public email: string,
    public password: string,
  ) {}
}

@CommandHandler(RegistrationCommand)
export class RegistrationCommandHandler implements ICommandHandler {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly emailAdapter: EmailAdapter,
  ) {}

  async execute({
    login,
    email,
    password,
  }: RegistrationCommand): Promise<InterLayerObject> {
    const userByLogin = await this.usersRepository.findUserByLoginOrEmail(login)
    if (userByLogin) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Пользователь с указанным логином уже существует',
      )
    }

    const userByEmail = await this.usersRepository.findUserByLoginOrEmail(email)
    if (userByEmail) {
      return new InterLayerObject(
        StatusCode.BadRequest,
        'Пользователь с указанным почтовым ящиком уже существует',
      )
    }

    const hashedPassword = await this.bcryptAdapter.generateHash(password)
    if (!hashedPassword) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка хэширования пароля',
      )
    }

    const newUser = new User()
    newUser.login = login
    newUser.email = email
    newUser.password = hashedPassword
    newUser.role = Roles.user

    const newEmailConfirmation = new EmailConfirmation()
    newUser.emailConfirmation = newEmailConfirmation
    newEmailConfirmation.isConfirmed = false
    newEmailConfirmation.confirmationCode = randomUUID()
    newEmailConfirmation.expirationDate = add(new Date(), {
      hours: 1,
      minutes: 30,
    })

    const savedUser = await this.usersRepository.save(newUser)
    if (!savedUser) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка сохранения пользователя',
      )
    }

    const isSent = await this.emailAdapter.sendEmail(
      email,
      'IRISART | Подтверждение регистрации',
      templateForRegistration(newEmailConfirmation.confirmationCode),
    )
    if (!isSent) {
      return new InterLayerObject(
        StatusCode.ServerError,
        'Ошибка отправки письма',
      )
    }
    return new InterLayerObject(StatusCode.NoContent)
  }
}
