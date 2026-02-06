import { Module } from '@nestjs/common';
import { UsersDomainController } from './users-domain.controller';
import { UsersDomainService } from './users-domain.service';
import { WishesModule } from '../wishes/wishes.module';
import { UsersModule } from '../users/users.module';

@Module({
	imports: [
		WishesModule,
		UsersModule
	],
  controllers: [UsersDomainController],
  providers: [UsersDomainService]
})
export class UsersDomainModule {}
