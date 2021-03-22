import {
  BadRequestException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { UserRepository } from 'src/auth/user/user.repository'
import { PermissionService } from 'src/permission/permission.service'
import { Book } from './book.entity'
import { BookRepository } from './book.repository'
import { CreateBookDto } from './dto/book-create.dto'
import { GiveBookDto } from './dto/book-give.dto'
import { ReturnBookDto } from './dto/book-return.dto'

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(BookRepository)
    private bookRepository: BookRepository,
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private permissionSerevice: PermissionService
  ) {}

  async giveBookToUser(giveBookDto: GiveBookDto): Promise<Book> {
    let user = await this.userRepository.getUserById(giveBookDto.userID)
    if (!user) {
      throw new BadRequestException(
        `User with id ${giveBookDto.userID} not found`
      )
    }
    let book = await this.bookRepository.getBookById(giveBookDto.bookID)
    if (!book) {
      throw new BadRequestException(
        `Book with id ${giveBookDto.bookID} not found`
      )
    }

    if (!(await this.permissionSerevice.checkPermission(user))) {
      throw new UnauthorizedException(
        'You have no permission, buy subscription'
      )
    }

    return await this.bookRepository.giveBook(user, book)
  }

  async createBook(createBookDto: CreateBookDto) {
    return await this.bookRepository.createBook(createBookDto)
  }

  async returnBook(returnBookDto: ReturnBookDto) {
    let book = await this.bookRepository.getBookById(returnBookDto.bookID)
    if (!book) {
      throw new BadRequestException(
        `Book with id ${returnBookDto.bookID} not found`
      )
    }
    return await this.bookRepository.returnBook(book)
  }
}
