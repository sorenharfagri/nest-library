import {
  BadRequestException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { User } from 'src/auth/user/user.entity'
import { dbErrorCodes } from 'src/config/db-error-codes'
import { EntityRepository, Repository } from 'typeorm'
import { Subscription } from '../entities/subscription.entity'

@EntityRepository(Subscription)
export class SubscriptionRepository extends Repository<Subscription> {
  private readonly logger = new Logger(SubscriptionRepository.name)

  async giveSubscription(user: User) {
    let subscription = this.create()
    subscription.user = user

    try {
      return await subscription.save()
    } catch (e) {
      if ((e.code = dbErrorCodes.duplicate)) {
        throw new BadRequestException('User already have subscription')
      } else {
        this.logger.error(`Error with save method `, e.code)
        throw new InternalServerErrorException()
      }
    }
  }

  async checkSubscription(user: User) {
    if (await this.findOne({ user })) {
      return true
    } else {
      return false
    }
  }
}
