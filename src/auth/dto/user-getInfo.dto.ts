import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty, IsNumberString, IsOptional } from 'class-validator'
import { ToBoolean } from 'src/helpers/ToBoolean'

export class GetUserInfoDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userID: number

  @IsOptional()
  @ToBoolean()
  booksTaken: boolean
}
