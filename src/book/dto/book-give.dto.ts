import { IsNotEmpty, IsNumber } from 'class-validator'
import { Transform } from 'class-transformer'

export class GiveBookDto {
  @IsNotEmpty()
  @Transform(bookID => parseInt(bookID), { toClassOnly: true })
  userID: number

  @IsNotEmpty()
  @Transform(bookID => parseInt(bookID), { toClassOnly: true })
  bookID: number
}
