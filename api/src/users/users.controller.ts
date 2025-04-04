import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Создать нового пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь создан', type: User })
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить всех пользователей с пагинацией' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей',
    type: [User],
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: User[]; total: number }> {
    return this.usersService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пользователя по ID' })
  @ApiResponse({
    status: 200,
    description: 'Найденный пользователь',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  findOne(@Param('id') id: string): Promise<User> {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Обновить пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Пользователь обновлен',
    type: User,
  })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь удален' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(+id);
  }
}
