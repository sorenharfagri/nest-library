import { User } from 'src/auth/user/user.entity'
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Book extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ unique: true })
  title: string

  @ManyToOne(type => User, user => user.books, {
    eager: false,
    cascade: false,
    onDelete: 'SET NULL'
  })
  user: User
}
