import { IsInt, IsNotEmpty, IsNumber } from 'class-validator'
import { Transform, Type } from 'class-transformer'

export class GiveBookDto {
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  userID: number

  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  bookID: number
}
