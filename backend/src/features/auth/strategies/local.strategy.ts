import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { User } from '../../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly _authService: AuthService
	) {
		super({
			usernameField: 'username',
		});
	}

	async validate(username: string, password: string): Promise<User> {
		const user = await this._authService.validateLoginUsernamePassword({ username, password });

		return user;
	}
}
