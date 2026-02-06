import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { createTypeOrmConfig } from './config/postgres.config';
import { AuthModule } from './features/auth/auth.module';
import { JoiPipeModule } from 'nestjs-joi';
import { getConfigJoi } from './config/joi.config';
import { WishesModule } from './features/wishes/wishes.module';
import { OffersModule } from './features/offers/offers.module';
import { WishlistModule } from './features/wishlist/wishlist.module';
import { UsersDomainModule } from './features/users-domain/users-domain.module';

const featuredModules = [
  AuthModule,
	UsersDomainModule,
  WishesModule,
  OffersModule,
  WishlistModule,
	UsersDomainModule
];

@Module({
  imports: [
    ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env'
		}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => createTypeOrmConfig(configService),
    }),
    ...featuredModules,

  ],
  controllers: [],
})
export class AppModule {}
