import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class CreateWishesDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  description: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;
}
