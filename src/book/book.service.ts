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
    private permissionService: PermissionService
  ) {}

  /* 
    Метод для выдачи книг пользователю с учётом ограничений

    В случае успеха возвращает выданную книгу и пользователя

    В dto содержатся айдишники пользователя и книги
    Метод с помощью них находит пользователя и книгу
    Проверяет доступ пользователя через permissionService

    И делегирует дальнейшую выдачу репозиторию

    В случае ошибок выбрасывает соответствующие исключения
  */

  async giveBook(giveBookDto: GiveBookDto): Promise<Book> {
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

    if (!(await this.permissionService.checkBookPermissions(user))) {
      throw new UnauthorizedException(
        'You have no permission, buy subscription'
      )
    }

    return await this.bookRepository.giveBook(user, book)
  }

  /*
    Создание книги
    В случае успеха возвращает вновь созданную книгу
  */

  async createBook(createBookDto: CreateBookDto) {
    return await this.bookRepository.createBook(createBookDto)
  }

  /*
    Возвращение книги
    Метод находит книгу по айдишнику из dto
    И делегирует логику репозиторию
    В случае успеха возвращает отданную книгу
  */

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
