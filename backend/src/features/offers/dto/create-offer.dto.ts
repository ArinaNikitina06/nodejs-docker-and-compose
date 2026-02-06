import {
  IsNumber,
  IsBoolean,
  IsOptional,
} from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsOptional()
  amount?: number;

  @IsBoolean()
  @IsOptional()
  hidden?: boolean;

  @IsNumber()
  @IsOptional()
  itemId?: number;
}
