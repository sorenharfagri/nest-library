import { Transform } from 'class-transformer'
import { IsNotEmpty } from 'class-validator'

export class ReturnBookDto {
  @IsNotEmpty()
  @Transform(bookID => parseInt(bookID), { toClassOnly: true })
  bookID: number
}
