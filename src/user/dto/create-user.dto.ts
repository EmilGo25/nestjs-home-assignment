import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
export class CreateUserDto {
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly name: string;
  @IsNumber()
  @IsNotEmpty()
  readonly roleNumber: number;
  @IsString()
  @MaxLength(30)
  @IsNotEmpty()
  readonly gender: string;
}
