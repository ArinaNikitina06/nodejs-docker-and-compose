import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
	CreateDateColumn,
	UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Offer } from '../offers/offer.entity';

@Entity({ name: 'wishes' })
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

 @Column({ length: 250 })
  name: string;

  @Column()
  link: string;

  @Column()
  image: string;

  // price — стоимость подарка
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string; // в TypeORM decimal лучше хранить как string

  // raised — сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  raised: string;

  // owner — ссылка на пользователя, добавившего подарок
  @ManyToOne(() => User, (user) => user.wishes, { nullable: false, onDelete: 'CASCADE' })
  owner: User;

  // description — от 1 до 1024 символов
  @Column({ type: 'varchar', length: 1024 })
  description: string;

  // offers — массив ссылок на заявки скинуться
  @OneToMany(() => Offer, (offer) => offer.wish)
  offers: Offer[];

  // copied — счётчик копирований, целое число
  @Column({ type: 'int', default: 0 })
  copied: number;

	@CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
