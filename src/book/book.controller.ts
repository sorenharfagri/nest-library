import {
  Body,
  Controller,
  ParseIntPipe,
  Patch,
  Post,
  ValidationPipe
} from '@nestjs/common'
import { BookService } from './book.service'
import { CreateBookDto } from './dto/book-create.dto'
import { GiveBookDto } from './dto/book-give.dto'
import { ReturnBookDto } from './dto/book-return.dto'

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Patch()
  giveBook(
    @Body(new ValidationPipe({ transform: true })) giveBookDto: GiveBookDto
  ) {
    return this.bookService.giveBookToUser(giveBookDto)
  }

  @Post()
  createBook(@Body(ValidationPipe) createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto)
  }

  @Patch('/return')
  returnBook(@Body(ValidationPipe) returnBookDto: ReturnBookDto) {
    return this.bookService.returnBook(returnBookDto)
  }
}
