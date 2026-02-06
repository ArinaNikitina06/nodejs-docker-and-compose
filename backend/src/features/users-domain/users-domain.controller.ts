import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RequestWithUser } from '../auth/types';
import { UsersDomainService } from './users-domain.service';
import { UsersDomainFindQueryDto } from './dto/users-domain-find-query.dto';
import { AuthGuard } from '@nestjs/passport';
import { WithEmail } from 'src/core/decorators/with-email.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersDomainController {

	constructor(
		private readonly _usersDomainService: UsersDomainService
	) {}

	@Get('me/wishes')
	async getWishes(
		@Req() req: RequestWithUser
	) {
		return this._usersDomainService.getWishesForUser(req.user);
	}

	@Get(':username')
	async getByUsername(
		@Param('username') username: string,
	) {
		return this._usersDomainService.getByUsername(username);
	}

	@Get(':username/wishes')
	async getWishesByUsername(
		@Param('username') username: string,
		@Req() req: RequestWithUser
	) {
		return this._usersDomainService.getWishesByUsername(username, req.user);
	}

	@WithEmail()
	@Post('find')
	async findQuery(
		@Body() usersDomainFindQueryDto: UsersDomainFindQueryDto
	) {
		return this._usersDomainService.findQuery(usersDomainFindQueryDto);
	}
}
