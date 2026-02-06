import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

	constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const salt = bcrypt.genSaltSync(10);

    const newUser = this._userRepository.create({
      ...createUserDto,
      password: bcrypt.hashSync(createUserDto.password, salt),
    });

    return this._userRepository.save(newUser);
  }

	getByEmail(email: string): Promise<User | null> {
    return this._userRepository.findOne({
			where: { email },
			relations: ['wishes', 'offers', 'wishlists']
		});
	}

	getById(id: number): Promise<User | null> {
    return this._userRepository.findOne({
			where: { id },
			relations: ['wishes', 'offers', 'wishlists']
		});
	}

	async updateUser(id: number, updates: Partial<User>): Promise<User> {
    await this._userRepository.update({ id }, updates);

    return this._userRepository.findOne({
			where: { id },
			relations: ['wishes', 'offers', 'wishlists']
		});
  }

	async findByUsername(username: string): Promise<User | null> {
		return this._userRepository.findOne({
			where: { username },
			relations: ['wishes', 'offers', 'wishlists']
		});
	}

	async searchByUsernameOrEmail(query: string): Promise<User[]> {
		return this._userRepository.find({
			where: [
				{ username: ILike(`%${query}%`) },
				{ email: ILike(`%${query}%`) },
			],
			relations: ['wishes', 'offers', 'wishlists'],
		});
	}
}
