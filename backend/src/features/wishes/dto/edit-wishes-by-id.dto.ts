import {
  IsString,
  MaxLength,
  IsOptional,
  IsNumber,
  IsUrl,
} from 'class-validator';

export class EditWishesByIdDto {
  @IsString()
  @MaxLength(250)
  @IsOptional()
  name?: string;

  @IsUrl()
  @IsOptional()
  link?: string;

  @IsUrl()
  @IsOptional()
  image?: string;

  @IsString()
  @MaxLength(1024)
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  price?: number;
}
