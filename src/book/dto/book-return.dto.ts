import { Type } from 'class-transformer'
import { IsInt, IsNotEmpty } from 'class-validator'

export class ReturnBookDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  bookID: number
}
