import { IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class AuthCredentiaslDto {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/(?:(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*)/, {
    message: 'Password must include uppercase, lowercase letters and a number',
  })
  password: string;
}
