import {
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
  Logger
} from '@nestjs/common'
import { User } from 'src/auth/user/user.entity'
import { dbErrorCodes } from 'src/config/db-error-codes'
import { EntityRepository, Repository } from 'typeorm'
import { Book } from './book.entity'
import { CreateBookDto } from './dto/book-create.dto'

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {
  private readonly logger = new Logger(BookRepository.name)

  async createBook(createBookDto: CreateBookDto) {
    const { title } = createBookDto
    let book = this.create()
    book.title = title

    try {
      return await book.save()
    } catch (e) {
      if (e.code === dbErrorCodes.duplicate) {
        throw new ConflictException(`Book with title ${title} already exists`)
      } else {
        this.logger.error(`Internal error:`, e)
        throw new InternalServerErrorException()
      }
    }
  }

  async giveBook(user: User, book: Book) {
    if (book.user) {
      throw new ConflictException('Book already taken by another person')
    }

    let userBooks = await user.books

    if (userBooks.length > 5) {
      throw new ConflictException('You cannot take more than 5 books')
    }

    book.user = user

    try {
      return await book.save()
    } catch (e) {
      this.logger.error(`Error with save operation: `, e)
      throw new InternalServerErrorException()
    }
  }

  async getBookById(bookID: number) {
    return await this.findOne({ id: bookID })
  }

  async returnBook(book: Book) {
    book.user = null

    try {
      return await book.save()
    } catch (e) {
      this.logger.error(`Error with save operation: `, e)
      throw new InternalServerErrorException()
    }
  }
}
