import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/*

 @hash: Хэш bcrypt-а, составленный из acces+refresh токенов
 @username: payload для jwt токена  

*/
@Entity()
export class RefreshToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string

  @Column()
  hash: string

  @Column()
  username: string
}
