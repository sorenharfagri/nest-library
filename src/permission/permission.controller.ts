import { Body, Controller, Post, ValidationPipe } from '@nestjs/common'
import { PermissionService } from './permission.service'

@Controller('permission')
export class PermissionController {
  constructor(private permissionService: PermissionService) {}

  @Post()
  giveSubscription(
    @Body(new ValidationPipe({ transform: true })) giveSubscriptionDto
  ) {
    return this.permissionService.giveSubscription(giveSubscriptionDto)
  }
}
