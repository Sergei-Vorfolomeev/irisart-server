import { IsUUID } from 'class-validator'
import { IsValidString } from '../../../infrastructure/decorators/is-valid-string.decorator'

export class ConfirmEmailInputModel {
  @IsUUID()
  @IsValidString()
  code: string
}
