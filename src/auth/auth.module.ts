import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PassportModule } from '@nestjs/passport'
import { JwtStrategy } from './jwt/jwt.strategy'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

import { RefreshTokenRepository } from './jwt/refreshToken/refreshToken.repository'
import { UserRepository } from './user/user.repository'
import * as config from 'config'

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt'
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || config.get('jwt.secret'),
      signOptions: {
        expiresIn: process.env.JWT_SECRET || config.get('jwt.expiresIn'),
        algorithm: 'HS512'
      }
    }),
    TypeOrmModule.forFeature([UserRepository]),
    TypeOrmModule.forFeature([RefreshTokenRepository])
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtStrategy, PassportModule]
})
export class AuthModule {}
