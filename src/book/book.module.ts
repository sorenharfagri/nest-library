import { Module } from '@nestjs/common'
import { BookService } from './book.service'
import { BookController } from './book.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserRepository } from 'src/auth/user/user.repository'
import { BookRepository } from './book.repository'
import { PermissionModule } from 'src/permission/permission.module'

@Module({
  providers: [BookService],
  controllers: [BookController],
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([BookRepository]),
    PermissionModule
  ]
})
export class BookModule {}
