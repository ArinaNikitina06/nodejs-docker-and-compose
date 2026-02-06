export class WishForeignDto {
  id: number;
  name: string;
  description: string;
  offers: {
    userId: number;
    username: string;
    amount: string | null;
  }[];
}
