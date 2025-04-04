import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { Min, Max } from 'class-validator';
import { IntersectionType } from '@nestjs/swagger';

class UserValidation {
  @Min(100)
  @Max(250)
  height?: number;

  @Min(30)
  @Max(300)
  weight?: number;
}

export class UpdateUserDto extends IntersectionType(
  PartialType(CreateUserDto),
  UserValidation,
) {}
