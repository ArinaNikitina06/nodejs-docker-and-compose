import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
	CreateDateColumn,
	UpdateDateColumn,
} from "typeorm";
import { User } from "../users/user.entity";
import { Wish } from "../wishes/wish.entity";

@Entity("offers")
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.offers)
  owner: User;

  @ManyToOne(() => Wish, (wish) => wish.offers)
  wish: Wish;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: false })
  hidden: boolean;
}
