import { Transform } from 'class-transformer'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { ToBoolean } from 'src/helpers/ToBoolean'

export class GetUserInfoDto {
  @IsNotEmpty()
  @Transform(bookID => parseInt(bookID), { toClassOnly: true })
  userID: number

  @IsOptional()
  @ToBoolean()
  booksTaken: boolean
}
