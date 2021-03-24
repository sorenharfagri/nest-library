import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
  ValidationPipe
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'

import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtPairDto } from './dto/jwt-pair.dto'
import { DeleteUserDto } from './dto/user-delete.dto'
import { EditUserDto } from './dto/user-edit.dto'
import { GetUserInfoDto } from './dto/user-getInfo.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /*
    Регистрация пользователя
    */
  @Post('/signup')
  signUp(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<void> {
    return this.authService.signUp(authCredentialsDto)
  }

  /*
    Логин, получение пары refresh+access токенов
    */
  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto
  ): Promise<JwtPairDto> {
    return this.authService.signIn(authCredentialsDto)
  }

  /*
     Обновление refresh токена
    */
  @Post('/refresh')
  refreshToken(
    @Body(ValidationPipe) JwtPairDto: JwtPairDto
  ): Promise<JwtPairDto> {
    return this.authService.refreshToken(
      JwtPairDto.accessToken,
      JwtPairDto.refreshToken
    )
  }

  @Get('/users')
  getUsers() {
    return this.authService.getUsers()
  }

  @Get('/user')
  getUser(
    @Body(new ValidationPipe({ transform: true })) getUserDto: GetUserInfoDto
  ) {
    return this.authService.getUserInfo(getUserDto)
  }

  @Delete('/user')
  deleteUser(@Body(ValidationPipe) deleteUserDto: DeleteUserDto) {
    return this.authService.deleteUser(deleteUserDto)
  }

  @Patch('/user')
  editUser(@Body(ValidationPipe) editUserDto: EditUserDto) {
    return this.authService.editUser(editUserDto)
  }

  /*
      Тест на владение актуальным access токеном
    */
  @Post('/test')
  @UseGuards(AuthGuard())
  test() {
    return {
      status: 'JWT token accepted'
    }
  }
}
