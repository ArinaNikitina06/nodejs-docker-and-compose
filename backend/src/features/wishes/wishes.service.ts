import {
	BadRequestException,
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateWishesDto } from './dto/create-wishes.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './wish.entity';
import { In, Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { EditWishesByIdDto } from './dto/edit-wishes-by-id.dto';
import { filterOffersWithWishForUser } from 'src/core/utils/filter-offers-with-wish-for-user';

@Injectable()
export class WishesService {
	constructor(
		@InjectRepository(Wish) private readonly _wishRepository: Repository<Wish>,
	) {}

	async create(createWishesDto: CreateWishesDto, owner: User): Promise<Wish> {
		const wishes = await this._wishRepository.create({
			...createWishesDto,
			price: createWishesDto.price.toFixed(2),
			owner,
		});

		return this._wishRepository.save(wishes);
	}

	/**
	 * Возвращает n последних созданных товаров
	 */
	async getLast(n: number, reqUser: User): Promise<Wish[]> {
		const lastIds = await this._wishRepository.find({
			select: ['id'],
			take: n,
			order: { createdAt: 'DESC' },
		});

		const wishes = await Promise.all(lastIds.map((w) => this.getById(w.id, reqUser)));
		return wishes;
	}

	/**
	 * Возвращает n самых закопированных товаров
	 */
	async getTop(n: number, reqUser: User): Promise<Wish[]> {
		const topIds = await this._wishRepository.find({
				select: ['id'],
				take: n,
				order: { copied: 'DESC' },
		});

		const wishes = await Promise.all(topIds.map((w) => this.getById(w.id, reqUser)));
		return wishes;
	}

	async getById(id: number, reqUser: User): Promise<Wish> {
		const wish = await this._wishRepository.findOne({
			where: { id },
			relations: ['owner', 'offers', 'offers.owner'],
		});

		if (!wish) {
			throw new NotFoundException(`Подарок с id ${id} не найден`);
		}

		if (!reqUser) {
			throw new NotFoundException(`Авторизованный пользователь не найден, невозможно получить подарок`);
		}

		const ItsMyWish = wish.owner.id === reqUser.id;

		if (!ItsMyWish) {
			delete wish.name;
			delete wish.link;
			delete wish.image;
			delete wish.raised
			delete wish.offers;
			delete wish.owner;
			return wish;
		}

		return {
			...wish,
			offers: filterOffersWithWishForUser(wish.offers, reqUser, wish.owner.id),
		};
	}

	async getByIdClean(id: number, reqUser: User): Promise<Wish> {
		const wish = await this._wishRepository.findOne({
			where: { id },
			relations: ['owner', 'offers', 'offers.owner'],
		});

		if (!wish) {
			throw new NotFoundException(`Подарок с id ${id} не найден`);
		}

		return {
			...wish,
			offers: filterOffersWithWishForUser(wish.offers, reqUser, wish.owner.id),
		};
	}

	async editById(
		id: number,
		editWishesByIdDto: EditWishesByIdDto,
		requestUser: User,
	): Promise<Wish> {
		const wish = await this._wishRepository.findOne({
			where: { id },
			relations: ['owner', 'offers'],
		});

		if (!wish) throw new NotFoundException(`Подарок с id ${id} не найден`);

		if (wish.owner.id !== requestUser.id) {
			throw new ForbiddenException(`Вы не можете редактировать чужой подарок`);
		}

		if (editWishesByIdDto.price !== undefined && wish.offers.length > 0) {
			throw new BadRequestException(
				`Нельзя изменять стоимость подарка, так как уже есть желающие скинуться`,
			);
		}

		if (editWishesByIdDto.name !== undefined)
			wish.name = editWishesByIdDto.name;
		if (editWishesByIdDto.link !== undefined)
			wish.link = editWishesByIdDto.link;
		if (editWishesByIdDto.image !== undefined)
			wish.image = editWishesByIdDto.image;
		if (editWishesByIdDto.description !== undefined)
			wish.description = editWishesByIdDto.description;
		if (editWishesByIdDto.price !== undefined)
			wish.price = editWishesByIdDto.price.toString();

		return this._wishRepository.save(wish);
	}

	async deleteById(
		id: number,
		requestUser: User,
	): Promise<{ message: string }> {
		const wish = await this._wishRepository.findOne({
			where: { id },
			relations: ['owner'],
		});

		if (!wish) {
			throw new NotFoundException(`Подарок с id ${id} не найден`);
		}

		if (wish.owner.id !== requestUser.id) {
			throw new ForbiddenException(`Вы не можете удалять чужой подарок`);
		}

		await this._wishRepository.remove(wish);

		return {
			message: `Подарок ${id} успешно удалён`,
		};
	}

	async copyById(id: number, requestUser: User): Promise<Wish> {
		const originalWish = await this._wishRepository.findOne({
			where: { id },
			relations: ['owner'],
		});

		if (!originalWish) {
			throw new NotFoundException(`Хотелка с id ${id} не найдена`);
		}

		const newWish = this._wishRepository.create({
			name: originalWish.name,
			link: originalWish.link,
			image: originalWish.image,
			price: originalWish.price,
			raised: '0',
			description: originalWish.description,
			owner: requestUser,
			copied: 0,
		});

		const savedWish = await this._wishRepository.save(newWish);

		originalWish.copied += 1;
		await this._wishRepository.save(originalWish);

		return savedWish;
	}

	async updateOfferRaised(id: number, raised: number): Promise<Wish> {
		const wish = await this._wishRepository.findOne({ where: { id } });

		if (!wish) {
			throw new NotFoundException(`Подарок с id ${id} не найден`);
		}

		wish.raised = raised.toString();

		return this._wishRepository.save(wish);
	}

	async findManyByIds(ids: number[], reqUser: User): Promise<Wish[]> {
		const wishes = await Promise.all(ids.map(id => this.getById(id, reqUser)));
		return wishes;
	}
}
