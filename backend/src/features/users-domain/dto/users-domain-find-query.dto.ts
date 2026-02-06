import { IsString, IsNotEmpty } from 'class-validator';

export class UsersDomainFindQueryDto {
  @IsString()
  @IsNotEmpty()
  query: string;
}
