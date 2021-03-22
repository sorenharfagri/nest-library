import { Module } from '@nestjs/common'
import { PermissionService } from './permission.service'
import { PermissionController } from './permission.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from 'src/auth/user/user.repository'
import { SubscriptionRepository } from './repositories/subscription.repository'

@Module({
  providers: [PermissionService],
  controllers: [PermissionController],
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([SubscriptionRepository])
  ],
  exports: [PermissionService]
})
export class PermissionModule {}
