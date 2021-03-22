import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm'
import * as bcrypt from 'bcryptjs'
import { Book } from 'src/book/book.entity'

/* 
   @password: Хешированый с помощью bcrypt-а пароль
   @salt: Bcrypt соль, с помощью которой можно валидировать полученный от пользователя пароль
*/
@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @Column()
  salt: string

  @OneToMany(type => Book, book => book.user, {
    eager: false,
    cascade: true
  })
  books: Promise<Book[]>

  async validatePassword(password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, this.salt)
    return hash === this.password
  }
}
