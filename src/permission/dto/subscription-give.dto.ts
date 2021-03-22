import { Transform } from 'class-transformer'
import { IsNotEmpty, IsNumberString } from 'class-validator'

export class GiveSubscriptionDto {
  @IsNotEmpty()
  @IsNumberString()
  @Transform(userID => parseInt(userID), { toClassOnly: true })
  userID: number
}
