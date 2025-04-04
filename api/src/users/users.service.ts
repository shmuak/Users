import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  private readonly dbPath = path.resolve(__dirname, '../../users.json');

  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase(): void {
    if (!fs.existsSync(this.dbPath)) {
      fs.writeFileSync(this.dbPath, JSON.stringify([]), 'utf8');
    }
  }

  private readUsers(): User[] {
    const data = fs.readFileSync(this.dbPath, 'utf8');
    try {
      return JSON.parse(data) as User[];
    } catch (error) {
      throw new Error(error);
    }
  }

  private writeUsers(users: User[]): void {
    fs.writeFileSync(this.dbPath, JSON.stringify(users, null, 2), 'utf8');
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const users = await this.readUsersAsync();
    const newUser: User = {
      id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
      ...createUserDto,
    };
    await this.writeUsersAsync([...users, newUser]);
    return newUser;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: User[]; total: number }> {
    const users = await this.readUsersAsync();
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedUsers = users.slice(startIndex, endIndex);
    return {
      data: paginatedUsers,
      total: users.length,
    };
  }

  async findOne(id: number): Promise<User> {
    const users = await this.readUsersAsync();
    const user = users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const users = await this.readUsersAsync();
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updatedUser = { ...users[userIndex], ...updateUserDto };
    users[userIndex] = updatedUser;
    await this.writeUsersAsync(users);
    return updatedUser;
  }

  async remove(id: number): Promise<void> {
    const users = await this.readUsersAsync();
    const userIndex = users.findIndex((u) => u.id === id);
    if (userIndex === -1) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    users.splice(userIndex, 1);
    await this.writeUsersAsync(users);
  }

  private async readUsersAsync(): Promise<User[]> {
    return new Promise<User[]>((resolve, reject) => {
      fs.readFile(this.dbPath, 'utf8', (err, data) => {
        if (err) return reject(err);
        try {
          resolve(JSON.parse(data) as User[]);
        } catch (parseError) {
          reject(new Error(parseError));
        }
      });
    });
  }

  private async writeUsersAsync(users: User[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      fs.writeFile(
        this.dbPath,
        JSON.stringify(users, null, 2),
        'utf8',
        (err) => {
          if (err) return reject(err);
          resolve();
        },
      );
    });
  }
}
