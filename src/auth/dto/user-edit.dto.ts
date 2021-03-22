import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class EditUserDto {
  @IsOptional()
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  newUsername: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  currentUsername;
}
