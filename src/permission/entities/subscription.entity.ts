import { User } from 'src/auth/user/user.entity'
import {
  BaseEntity,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn
} from 'typeorm'

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToOne(() => User, { cascade: true, onDelete: 'CASCADE' })
  @JoinColumn()
  user: User
}
