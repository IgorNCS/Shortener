import { IsOptional, IsString, MinLength, MaxLength, Matches, ValidateIf, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  newPassword?: string;

  @ValidateIf((o) => o.newPassword)
  @IsString()
  @MinLength(8)
  @MaxLength(32)
  confirmNewPassword?: string;

  @IsOptional()
  @IsString()
  name?: string;
}
