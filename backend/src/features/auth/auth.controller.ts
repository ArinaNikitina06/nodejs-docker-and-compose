import { Body, Controller, Post, Res, Get, UseGuards, Req, Patch } from '@nestjs/common';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/sign-in.dto';
import { Response } from 'express';
import { RequestWithUser } from './types';
import { EditMeDto } from './dto/edit-me.dto';
import { AuthGuard } from '@nestjs/passport';
import { WithEmail } from 'src/core/decorators/with-email.decorator';

@Controller()
export class AuthController {

	constructor(
		private readonly _authService: AuthService
	) {}

	@Post('signin')
	@UseGuards(AuthGuard('local'))
	async signIn(
		@Body() signInDto: SignInDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { access_token } = await this._authService.signIn(signInDto);

		res.cookie('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60 * 24,
		});

		return {
			access_token
		};
	}

	@WithEmail()
	@Post('signup')
	async signUp(
		@Body() signUpDto: SignUpDto,
		@Res({ passthrough: true }) res: Response,
	) {
		const { access_token, user } = await this._authService.signUp(signUpDto);

		res.cookie('access_token', access_token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 1000 * 60 * 60 * 24,
		});

		return user
	}

	@WithEmail()
	@Get('users/me')
	@UseGuards(AuthGuard('jwt'))
	async getMe(
		@Req() req: RequestWithUser
	) {
		return this._authService.getMe(req.user);
	}

	@WithEmail()
	@Patch('users/me')
	@UseGuards(AuthGuard('jwt'))
	editMe(
		@Body() editMeDto: EditMeDto,
		@Req() req: RequestWithUser
	) {
		return this._authService.editMe(editMeDto, req.user);
	}
}
