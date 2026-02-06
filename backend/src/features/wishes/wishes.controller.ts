import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishesDto } from './dto/create-wishes.dto';
import { RequestWithUser } from '../auth/types';
import { EditWishesByIdDto } from './dto/edit-wishes-by-id.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('wishes')
export class WishesController {

	constructor(
		private readonly _wishesService: WishesService
	) {}

	@Post()
	async create(
		@Body() createWishesDto: CreateWishesDto,
		@Req() req: RequestWithUser
	) {
		return this._wishesService.create(createWishesDto, req.user);
	}

	@Get('last')
	async getLast(
		@Req() req: RequestWithUser
	) {
		return this._wishesService.getLast(40, req.user);
	}

	@Get('top')
	async getTop(
		@Req() req: RequestWithUser
	) {
		return this._wishesService.getTop(20, req.user);
	}

	@Get(':id')
	async getById(
		@Req() req: RequestWithUser,
		@Param('id', ParseIntPipe) id: number
	) {
		return this._wishesService.getById(id, req.user);
	}

	@Patch(':id')
	async editById(
		@Param('id', ParseIntPipe) id: number,
		@Body() editWishesByIdDto: EditWishesByIdDto,
		@Req() req: RequestWithUser
	) {
		return this._wishesService.editById(id, editWishesByIdDto, req.user);
	}

	@Delete(':id')
	async deleteById(
		@Param('id', ParseIntPipe) id: number,
		@Req() req: RequestWithUser
	) {
		return this._wishesService.deleteById(id, req.user);
	}

	@Post(':id/copy')
	async copyById(
		@Param('id', ParseIntPipe) id: number,
		@Req() req: RequestWithUser
	) {
		return this._wishesService.copyById(id, req.user);
	}
}
