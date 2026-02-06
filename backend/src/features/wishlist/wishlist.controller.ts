import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { RequestWithUser } from '../auth/types';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('wishlistlists')
export class WishlistController {

	constructor(
		private readonly _wishlistService: WishlistService
	) {}

	@UseGuards(AuthGuard('jwt'))
	@Post()
  create(
		@Body() createWishlistDto: CreateWishlistDto,
		@Req() req: RequestWithUser
	) {
    return this._wishlistService.create(createWishlistDto, req.user);
  }

	@UseGuards(AuthGuard('jwt'))
	@Get()
	async getAll(
		@Req() req: RequestWithUser
	) {
		return this._wishlistService.getAll(req.user);
	}

	@Get(':id')
	async getById(
		@Param('id', ParseIntPipe) id: number
	) {
		return this._wishlistService.getById(id);
	}

	@UseGuards(AuthGuard('jwt'))
	@Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Req() req: RequestWithUser
  ) {
    return this._wishlistService.update(id, updateWishlistDto, req.user);
  }

	@UseGuards(AuthGuard('jwt'))
	@Delete(':id')
  remove(
		@Param('id', ParseIntPipe) id: number,
		@Req() req: RequestWithUser
	) {
    return this._wishlistService.remove(id, req.user);
  }

}
