import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsNumberString } from 'class-validator'

export class GiveSubscriptionDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userID: number
}
