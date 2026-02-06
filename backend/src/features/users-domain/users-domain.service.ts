import { Injectable } from '@nestjs/common';
import { WishesService } from '../wishes/wishes.service';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { Wish } from '../wishes/wish.entity';
import { UsersDomainFindQueryDto } from './dto/users-domain-find-query.dto';

@Injectable()
export class UsersDomainService {

	constructor(
		private readonly _wishesService: WishesService,
		private readonly _usersService: UsersService
	) {}

	async getWishesForUser(user: User) {
		return this._wishesService.findManyByIds(user.wishes.map(wish => wish.id), user);
	}

	async getByUsername(username: string): Promise<User | null> {
		return this._usersService.findByUsername(username);
	}

	async getWishesByUsername(username: string, reqUser: User): Promise<Wish[]> {
		const user = await this._usersService.findByUsername(username);
		return this._wishesService.findManyByIds(user.wishes.map(wish => wish.id), reqUser);
	}

	async findQuery(usersDomainFindQueryDto: UsersDomainFindQueryDto): Promise<User[]> {
		const usernameOrEmail = usersDomainFindQueryDto.query;
		return this._usersService.searchByUsernameOrEmail(usernameOrEmail);
	}
}
