import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import * as bcrypt from 'bcryptjs'

import { UserRepository } from './user/user.repository'
import { RefreshTokenRepository } from './jwt/refreshToken/refreshToken.repository'

import { AuthCredentialsDto } from './dto/auth-credentials.dto'
import { JwtPairDto } from './dto/jwt-pair.dto'

import { JwtPayload } from './jwt/jwt-payload.interface'
import { DeleteUserDto } from './dto/user-delete.dto'
import { EditUserDto } from './dto/user-edit.dto'
import { GetUserDto } from './dto/user-get.dto'
import { User } from './user/user.entity'

@Injectable()
export class AuthService {
  /*
    Сюда падает null, в случае если валидация пользователя не происходит
  */
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    @InjectRepository(RefreshTokenRepository)
    private refreshTokenRepository: RefreshTokenRepository,
    private jwtService: JwtService
  ) {}

  /* 
    Регистрация пользователя
  */
  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    return this.userRepository.signUp(authCredentialsDto)
  }

  /*
    Логин пользователя
    Выплёвывает пару новых access+refresh токенов при успехе
    В ином случае - UnathorizedException
  */

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<JwtPairDto> {
    /*
      Сюда падает null, в случае если валидация пользователя не происходит
    */
    const username = await this.userRepository.validateUserPassword(
      authCredentialsDto
    )

    if (!username) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload: JwtPayload = { username }
    const accessToken = await this.jwtService.sign(payload)
    const refreshToken = await this.refreshTokenRepository.generateRefreshToken(
      accessToken,
      username
    )

    return { accessToken, refreshToken }
  }

  /* 
     Метод для обновления пары access+refresh токенов

     В случае неудачи выпадает UnauthorizedException

     В случае успеха выдаст новую пару access+refresh токенов, если:
     Refresh токен совпадает с имеющимся в базе, и был выдан вместе с access токеном который метод получает на вход

     По факту в бд хранится хеш access+refresh токенов
     Соль, которым происходило хеширование, выдаётся юзеру в виде refresh токена
     
     Метод же хеширует пару access_token + соль (refreshToken), и затем ищет получившийся хеш в бд
     Если хеш не будет найден - у юзера либо невалидный refresh token
     Либо невалидный access token, который выдавался не вместе с имеющимся refresh token
     
    */
  async refreshToken(
    oldAccessToken: string,
    oldRefreshToken: string
  ): Promise<JwtPairDto> {
    const refreshTokenHash = await bcrypt.hash(
      oldAccessToken.split('.')[2] + oldRefreshToken,
      oldRefreshToken
    )
    const refreshTokenDB = await this.refreshTokenRepository.findOne({
      hash: refreshTokenHash
    })

    if (!refreshTokenDB) {
      throw new UnauthorizedException(`Invalid tokens`)
    }

    const payload: JwtPayload = { username: refreshTokenDB.username }

    const newAccesToken = await this.jwtService.sign(payload)
    const salt = await bcrypt.genSalt(10)

    refreshTokenDB.hash = await bcrypt.hash(
      newAccesToken.split('.')[2] + salt,
      salt
    )

    try {
      await refreshTokenDB.save()
      return { accessToken: newAccesToken, refreshToken: salt }
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async getUser(getUserDto: GetUserDto) {
    return await this.userRepository.getUserInfo(getUserDto)
  }

  async getUsers() {
    return await this.userRepository.getUsers()
  }

  /*
    Метод для удаления пользовател
    В случае успеха возвращает удалённого пользователя

    В случае если пользователь не будет найден 
    DeleteUser выбросит исключение

    Так-же метод удаляет рефреш токены пренадлежавшие пользователю
  */

  async deleteUser(deleteUserDto: DeleteUserDto): Promise<User> {
    let deletedUser = await this.userRepository.deleteUser(deleteUserDto)
    await this.refreshTokenRepository.deleteUserRefreshTokens(
      deleteUserDto.username
    )
    return deletedUser
  }

  /*
    Метод для редактирования пользователя
    В случае успеха возвращает отредактированного пользователя
    И аннулирует рефреш токены пользователя

    Либо выбрасывает эксепшены исходя из логики репозитория

    Саму логику редактирования делегирует репозиторию
  */

  async editUser(editUserDto: EditUserDto): Promise<User> {
    let user = await this.userRepository.editUser(editUserDto)
    await this.refreshTokenRepository.deleteUserRefreshTokens(user.username)
    return user
  }
}
