import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { User } from '../../users/user.entity';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private readonly configService: ConfigService,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(req: Request) => {
					if (req?.cookies?.access_token) {
						return req.cookies.access_token;
					}

					const authHeader = req?.headers?.authorization;
					if (authHeader?.startsWith('Bearer ')) {
						return authHeader.split(' ')[1];
					}

					return null;
				},
			]),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}

	async validate(payload: { sub: number }): Promise<User> {
		const user = await this.usersService.getById(payload.sub);

		if (!user) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		return user;
	}
}
