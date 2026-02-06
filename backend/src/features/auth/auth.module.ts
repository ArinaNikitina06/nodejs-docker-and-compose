import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJWTconfig } from 'src/config/jwt.config';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
		//JwtCookieOrHeaderGuardModule,
		UsersModule,
		PassportModule,
		ConfigModule,
		JwtModule.registerAsync({
    	imports: [ConfigModule],
   	  inject: [ConfigService],
    	useFactory: getJWTconfig,
    }),

  ],
  controllers: [AuthController],
  providers: [
    AuthService,
		LocalStrategy,
		JwtStrategy
  ],
  exports: [
    AuthService
  ]
})
export class AuthModule {}
