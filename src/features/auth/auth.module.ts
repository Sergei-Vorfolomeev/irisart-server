import { Module } from '@nestjs/common'
import { UsersModule } from '../users/users.module'
import { CqrsModule } from '@nestjs/cqrs'
import { AuthController } from './auth.controller'
import { SignUpCommandHandler } from './usecases/commands/sign-up.command'
import { SignInCommandHandler } from './usecases/commands/sign-in.command'
import { ConfirmEmailCommandHandler } from './usecases/commands/confirm-email.command'
import { ResendCodeCommandHandler } from './usecases/commands/resend-code.command'
import { SignOutCommandHandler } from './usecases/commands/sign-out.command'
import { RecoverPasswordCommandHandler } from './usecases/commands/recover-password.command'
import { SetNewPasswordCommandHandler } from './usecases/commands/set-new-password.command'
import { UpdateTokensCommandHandler } from './usecases/commands/update-tokens.command'
import { SignInAfterEmailConfirmationCommandHandler } from './usecases/commands/sign-in-after-email-confirmation.command'
import { MeQueryHandler } from './usecases/queries/me.query'
import { CryptoModule } from '../../base/adapters/crypto/crypto.module'
import { BcryptModule } from '../../base/adapters/bcrypt/bcrypt.module'
import { NodeMailerModule } from '../../base/adapters/node-mailer/node-mailer.module'

const authUseCases = [
  SignUpCommandHandler,
  SignInCommandHandler,
  SignInAfterEmailConfirmationCommandHandler,
  ConfirmEmailCommandHandler,
  ResendCodeCommandHandler,
  SignOutCommandHandler,
  RecoverPasswordCommandHandler,
  SetNewPasswordCommandHandler,
  UpdateTokensCommandHandler,
  MeQueryHandler,
]

@Module({
  imports: [
    CqrsModule,
    UsersModule,
    CryptoModule,
    BcryptModule,
    NodeMailerModule,
  ],
  providers: [...authUseCases],
  controllers: [AuthController],
  exports: [],
})
export class AuthModule {}
