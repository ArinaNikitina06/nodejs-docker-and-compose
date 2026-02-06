import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	ManyToMany,
	JoinTable,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Wish } from '../wishes/wish.entity';

@Entity()
export class Wishlist {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn()
	createdAt: Date;

	@UpdateDateColumn()
	updatedAt: Date;

	@Column({ length: 250 })
	name: string;

	@Column()
	image: string;

	@ManyToOne(() => User, (user) => user.wishlists)
	owner: User;

	@ManyToMany(() => Wish)
	@JoinTable()
	items: Wish[];
}
