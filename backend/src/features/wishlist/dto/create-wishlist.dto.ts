import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsOptional,
  IsUrl,
  IsArray,
  IsNumber,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  name: string;

  @IsUrl()
  @IsNotEmpty()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  itemsId: number[];
}
