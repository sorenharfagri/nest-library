import { Transform } from 'class-transformer'
import {
  IsBoolean,
  IsBooleanString,
  IsNotEmpty,
  IsOptional
} from 'class-validator'
import { ToBoolean } from 'src/helpers/ToBoolean'

export class GetUserDto {
  @IsNotEmpty()
  @Transform(bookID => parseInt(bookID), { toClassOnly: true })
  userID: number

  @IsOptional()
  @ToBoolean()
  booksTaken: boolean
}
