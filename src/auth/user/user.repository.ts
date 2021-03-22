import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger,
  NotFoundException
} from '@nestjs/common'
import { EntityRepository, Repository } from 'typeorm'
import * as bcrypt from 'bcryptjs'

import { AuthCredentialsDto } from '../dto/auth-credentials.dto'
import { User } from './user.entity'
import { EditUserDto } from '../dto/user-edit.dto'
import { DeleteUserDto } from '../dto/user-delete.dto'
import { dbErrorCodes } from '../../config/db-error-codes'
import { GetUserDto } from '../dto/user-get.dto'

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  /*
      Регистрация нового пользователя
      При регистрации пароль хешируется bcrypt-ом, и записывается в user-а, вместе с солью
      В случае если никнейм уже используется - метод выплюнет ConflictException
    */

  private readonly logger = new Logger(UserRepository.name)

  async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto

    const user = this.create()
    user.username = username
    await this.setUserPassword(user, password)

    try {
      await user.save()
    } catch (e) {
      if (e.code === dbErrorCodes.duplicate) {
        //duplicate username
        throw new ConflictException('Username already exists')
      } else {
        this.logger.error('Error with save operation: ', e)
        throw new InternalServerErrorException()
      }
    }
  }

  async getUserById(userID: number) {
    return await this.findOne({ id: userID })
  }

  async getUserInfo(getUserDto: GetUserDto) {
    const { userID, booksTaken } = getUserDto

    let user = await this.getUserById(userID)

    if (!user) {
      throw new BadRequestException(`User with id ${userID} not found`)
    }

    if (booksTaken) {
      await user.books
    }

    return user
  }

  /* 
    Валидация пароля пользователя
    В случае несовпадения метод выплёвывает null
    */
  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto
  ): Promise<string> {
    const { username, password } = authCredentialsDto

    const user = await this.findOne({ username })

    if (user && (await user.validatePassword(password))) {
      return user.username
    } else {
      return null
    }
  }

  async deleteUser(deleteUserDto: DeleteUserDto) {
    const { username } = deleteUserDto
    let user: User = await this.findOne({ username })

    if (!user) {
      throw new NotFoundException(`User not found`)
    }

    try {
      return await user.remove()
    } catch (e) {
      throw new InternalServerErrorException()
    }
  }

  async editUser(editUserDto: EditUserDto) {
    const { newUsername, newPassword, currentUsername } = editUserDto

    // Выбросит ли эксепшн, проверить
    let user = await this.findOne({ username: currentUsername })

    if (!user) {
      throw new NotFoundException(
        `User with username: '${currentUsername}' not found`
      )
    }

    // TODO Проверить сохранение

    if (newUsername) {
      user.username = newUsername
    }

    if (newPassword) {
      await this.setUserPassword(user, newPassword)
    }

    try {
      return await user.save()
    } catch (e) {
      if (e.code === dbErrorCodes.duplicate) {
        //duplicate username
        throw new ConflictException('Username already exists')
      } else {
        this.logger.error('Internal error: ', e)
        throw new InternalServerErrorException()
      }
    }
  }

  async setUserPassword(user: User, password: string) {
    user.salt = await bcrypt.genSalt()
    user.password = await this.hashPassword(password, user.salt)
    return user
  }

  async getUsers() {
    return await this.find()
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt)
  }
}
