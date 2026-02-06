import * as bcrypt from 'bcrypt';
import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	UnauthorizedException,
} from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { UsersService } from '../users/users.service';
import { User } from '../users/user.entity';
import { SignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { EditMeDto } from './dto/edit-me.dto';

@Injectable()
export class AuthService {
	constructor(
		private readonly _usersService: UsersService,
		private readonly _jwtService: JwtService,
	) {}

	async signIn(signInDto: SignInDto) {
		const validatedUser = await this.validateLoginUsernamePassword(signInDto);

		return this._generateJwtTokens(validatedUser);
	}

	async signUp(signUpDto: SignUpDto) {
		try {
			const user = await this._usersService.create(signUpDto);
			const { access_token } = await this._generateJwtTokens(user);

			return {
				access_token,
				user
			};
		} catch (error) {
			console.error(error);

			if (error?.code === '23505') {
				const detail: string = error.detail || '';

				if (detail.includes('email')) {
					throw new UnauthorizedException(
						`Пользователь с email "${signUpDto.email}" уже существует`,
					);
				}

				if (detail.includes('username')) {
					throw new UnauthorizedException(
						`Пользователь с username "${signUpDto.username}" уже существует`,
					);
				}

				throw new UnauthorizedException('Нарушено уникальное ограничение');
			}

			throw new InternalServerErrorException('Ошибка сервера');
		}
	}

	async getMe(currentUser: User): Promise<User> {
		return currentUser;
	}

	async editMe(editMeDto: EditMeDto, currentUser: User): Promise<User> {
		const updates: Partial<User> = {};
		const salt = bcrypt.genSaltSync(10);

		if (editMeDto.email) updates.email = editMeDto.email;
		if (editMeDto.username) updates.username = editMeDto.username;
		if (editMeDto.about) updates.about = editMeDto.about;
		if (editMeDto.avatar) updates.avatar = editMeDto.avatar;
		if (editMeDto.password) updates.password = bcrypt.hashSync(editMeDto.password, salt);

		try {
			return await this._usersService.updateUser(currentUser.id, updates);
		} catch (error) {
			console.error(error);

			if (error?.code === '23505') {
				const detail = error.detail || '';

				if (detail.includes('email')) {
					throw new BadRequestException(
						`Пользователь с email "${editMeDto.email}" уже существует`,
					);
				}

				if (detail.includes('username')) {
					throw new BadRequestException(
						`Пользователь с username "${editMeDto.username}" уже существует`,
					);
				}
			}

			throw new InternalServerErrorException('Ошибка обновления данных');
		}
	}

	async validateLoginUsernamePassword(signInDto: SignInDto): Promise<User> {
		const user = await this._usersService.findByUsername(signInDto.username);

		if (!user) {
			throw new UnauthorizedException('Пользователь не найден');
		}

		const isPasswordValid = await bcrypt.compare(signInDto.password, user.password);

		if (!isPasswordValid) {
			throw new UnauthorizedException('Неверный пароль');
		}

		return user;
	}

	private async _generateJwtTokens(
		user: User,
	): Promise<{ access_token: string }> {
		const payload = { sub: user.id };

		return {
			access_token: this._jwtService.sign(payload),
		};
	}
}
