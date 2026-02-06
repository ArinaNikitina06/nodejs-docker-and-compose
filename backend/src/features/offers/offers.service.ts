import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { filterOffersForUser } from 'src/core/utils/filter-offers-for-user';


@Injectable()
export class OffersService {
	constructor(
		private readonly _wishesService: WishesService,
		@InjectRepository(Offer) private readonly _offerRepository: Repository<Offer>,
	) {}

	async create(createOfferDto: CreateOfferDto, reqUser: User) {
		const { amount, hidden, itemId } = createOfferDto;

		// Получаем подарок
		const wish = await this._wishesService.getByIdClean(itemId, reqUser);

		if (wish.owner.id === reqUser.id) {
			throw new ForbiddenException(
				`Вы не можете скинуться на собственный подарок`,
			);
		}

		console.log('Дошли сюда')

		const price = Number(wish.price);
		const raised = Number(wish.raised);

		if (raised >= price) {
			throw new BadRequestException(`На подарок уже собрана полная сумма`);
		}

		const remaining = price - raised;

		if (amount > remaining) {
			throw new BadRequestException(
				`Вы не можете внести сумму больше, чем осталось собрать (${remaining.toFixed(2)})`,
			);
		}

		// Создаём оффер
		const offer = this._offerRepository.create({
			amount,
			hidden: !!hidden,
			owner: reqUser,
			wish,
		});

		const savedOffer = await this._offerRepository.save(offer);

		await this._wishesService.updateOfferRaised(wish.id, amount);

		return savedOffer;
	}

	async getAll(reqUser: User) {
		const offers = await this._offerRepository.find({
			relations: ['owner', 'wish'],
		});

		return filterOffersForUser(offers, reqUser);
	}

	async findOne(id: number, user: User) {
		const offer = await this._offerRepository.findOne({
			where: { id },
			relations: ['owner', 'wish'],
		});

    return filterOffersForUser([offer], user)[0];
  }
}
