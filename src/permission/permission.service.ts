import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user/user.entity'
import { UserRepository } from 'src/auth/user/user.repository'
import { GiveSubscriptionDto } from './dto/subscription-give.dto'
import { Subscription } from './entities/subscription.entity'
import { SubscriptionRepository } from './repositories/subscription.repository'

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(SubscriptionRepository)
    private subscriptionRepository: SubscriptionRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  /*
    Проверка наличия у пользователя какого-либо доступа для взятия книг
    Возвращает boolean в зависимости от наличия доступов
    Служит фасадом
  */

  async checkBookPermissions(user: User): Promise<Boolean> {
    return await this.subscriptionRepository.checkSubscription(user)
  }

  /*
    Выдача пользователю подписки
    В случае успеха возвращает подписку и пользователя
    
    Возвращает исключения в случае:
    У пользователя уже имеется подписка
    Пользователь не найден

    Логику выдачи передаёт репозиторию
  */
  async giveSubscription(
    giveSubscriptionDto: GiveSubscriptionDto
  ): Promise<Subscription> {
    let user = await this.userRepository.getUserById(giveSubscriptionDto.userID)
    if (!user) {
      throw new BadRequestException(
        `User with id ${giveSubscriptionDto.userID} not found`
      )
    }
    return await this.subscriptionRepository.giveSubscription(user)
  }
}
