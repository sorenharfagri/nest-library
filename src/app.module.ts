import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { typeOrmConfig } from './config/typeorm.config'
import { AuthModule } from './auth/auth.module'
import { BookModule } from './book/book.module'
import { PermissionModule } from './permission/permission.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), AuthModule, BookModule, PermissionModule],
  controllers: []
})
export class AppModule {}
