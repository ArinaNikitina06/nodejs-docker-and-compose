import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Offer } from '../offers/offer.entity';
import { Wish } from '../wishes/wish.entity';
import { Wishlist } from '../wishlist/wishlist.entity';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Entity()
export class User {
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @Expose()
  @Column({ unique: true, length: 30 })
  username: string;

	@Expose({ groups: ['email'] })
  @Column({ unique: true })
  email: string;

  @Expose()
  @Column({ length: 200, default: 'Пока ничего не рассказал о себе' })
  about: string;

  @Expose()
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  avatar: string;

  @Exclude()
  @Column()
  password: string;

  @Expose({ groups: ['wishes'] })
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @Expose({ groups: ['offers'] })
  @OneToMany(() => Offer, (offer) => offer.owner)
  offers: Offer[];

  @Expose({ groups: ['wishlists'] })
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;
}
