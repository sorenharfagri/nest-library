import { BadRequestException, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from 'src/auth/user/user.entity'
import { UserRepository } from 'src/auth/user/user.repository'
import { GiveSubscriptionDto } from './dto/subscription-give.dto'
import { SubscriptionRepository } from './repositories/subscription.repository'

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(SubscriptionRepository)
    private subscriptionRepository: SubscriptionRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository
  ) {}

  async checkPermission(user: User) {
    return await this.subscriptionRepository.checkSubscription(user)
  }

  async giveSubscription(giveSubscriptionDto: GiveSubscriptionDto) {
    let user = await this.userRepository.getUserById(giveSubscriptionDto.userID)
    if (!user) {
      throw new BadRequestException(
        `User with id ${giveSubscriptionDto.userID} not found`
      )
    }
    return await this.subscriptionRepository.giveSubscription(user)
  }
}
