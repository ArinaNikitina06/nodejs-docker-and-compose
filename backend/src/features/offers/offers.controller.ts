import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { RequestWithUser } from '../auth/types';
import { AuthGuard } from '@nestjs/passport';

@Controller('offers')
export class OffersController {

	constructor(
		private readonly _offersService: OffersService
	) {}

	@Post()
	@UseGuards(AuthGuard('jwt'))
	create(
		@Body() createOfferDto: CreateOfferDto,
		@Req() req: RequestWithUser
	) {
		return this._offersService.create(createOfferDto, req.user);
	}

	@Get()
	@UseGuards(AuthGuard('jwt'))
	getAll(
		@Req() req: RequestWithUser
	) {
		return this._offersService.getAll(req.user);
	}

	@Get(':id')
	@UseGuards(AuthGuard('jwt'))
  findOne(
		@Param('id', ParseIntPipe) id: number,
		@Req() req: RequestWithUser
	) {
    return this._offersService.findOne(id, req.user);
  }

}
