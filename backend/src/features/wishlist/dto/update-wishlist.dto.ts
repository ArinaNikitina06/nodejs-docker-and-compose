import {
  IsString,
  MaxLength,
  IsOptional,
  IsUrl,
  IsArray,
  IsNumber,
} from 'class-validator';

export class UpdateWishlistDto {
  @IsString()
  @MaxLength(250)
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  itemsId?: number[];

  @IsString()
  @MaxLength(1500)
  @IsOptional()
  description?: string;
}
