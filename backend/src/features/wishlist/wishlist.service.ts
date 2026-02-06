import { BadRequestException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist } from './wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from '../users/user.entity';
import { WishesService } from '../wishes/wishes.service';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { filterOffersForUser } from 'src/core/utils/filter-offers-for-user';

@Injectable()
export class WishlistService {
	constructor(
		@InjectRepository(Wishlist) private readonly _wishlistRepository: Repository<Wishlist>,
		private readonly _wishesService: WishesService
	) { }

	async create(createWishlistDto: CreateWishlistDto, user: User): Promise<Wishlist> {
		const wishes = await this._wishesService.findManyByIds(createWishlistDto.itemsId, user);

		const foundWishesIds = wishes.map(w => w.id);
		const missingWishesIds = createWishlistDto.itemsId.filter(id => !foundWishesIds.includes(id));

		if (missingWishesIds.length > 0) {
			throw new BadRequestException(
				`Подарки с id [${missingWishesIds.join(', ')}] не существуют`,
			);
		}

		const wishlist = this._wishlistRepository.create({
			name: createWishlistDto.name,
			image: createWishlistDto.image,
			items: wishes,
			owner: user,
		});

		return this._wishlistRepository.save(wishlist);
	}

	async getAll(user: User): Promise<Wishlist[]> {
		const wishLists = await this._wishlistRepository.find({
			relations: ['items', 'owner']
		});

		return Promise.all(
			wishLists.map(async (w) => ({
				...w,
				items: await Promise.all(
					w.items.map((wish) => {
						return this._wishesService.getById(wish.id, user)
					})
				),
			}))
		);
	}

	async getById(id: number): Promise<Wishlist> {
		const wishlist = await this._wishlistRepository.findOne({
			where: { id },
			relations: ['items', 'owner']
		});

		if (!wishlist) {
			throw new NotFoundException('Список желаний не найден');
		}

		return wishlist;
	}

	async update(
		id: number,
		updateWishlistDto: UpdateWishlistDto,
		user: User,
	): Promise<Wishlist> {
		const wishList = await this.getById(id);

		if (wishList.owner.id !== user.id) {
			throw new BadRequestException('Вы не можете изменить список другого пользователя');
		}

		const { itemsId, ...otherFields } = updateWishlistDto;

		if (otherFields.name !== undefined) wishList.name = otherFields.name;
		if (otherFields.image !== undefined) wishList.image = otherFields.image;

		if (itemsId) {
			if (itemsId.length > 0) {
				const wishes = await this._wishesService.findManyByIds(itemsId, user);
				wishList.items = wishes;
			} else {
				wishList.items = [];
			}
		}

		return this._wishlistRepository.save(wishList);
	}

	async remove(id: number, user: User) {
		const wishList = await this._wishlistRepository.findOne({
			relations: {
				owner: true,
			},
			where: {
				id
			},
		});

		if (!wishList) {
			throw new NotFoundException('Список желаний не найден');
		}

		if (wishList.owner.id !== user.id) {
			throw new BadRequestException('Вы не можете удалить список другого пользователя');
		}

		return await this._wishlistRepository.remove(wishList);
	}
}
