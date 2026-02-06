export class WishOwnDto {
  id: number;
  name: string;
  image: string;
  link: string;
  price: string;
  raised: string;
  progress: number;
  offers: {
    userId: number;
    username: string;
    amount: string;
  }[];
}
