import {
  ClassSerializerInterceptor,
  ConflictException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Not, Repository } from 'typeorm';
import { createInvalidObservableTypeError } from 'rxjs/internal/util/throwUnobservableError';
import { asyncWrapProviders } from 'async_hooks';
import * as bcrypt from 'bcrypt';
import { IDuplicateResponse } from './interface/user.interface';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private readonly userSelectFields: { [key: string]: boolean } = {
    id: true,
    name: true,
    email: true,
    avatar_url: true,
    created_at: true,
    google_id: true,
    last_name: true,
    role: true,
    updated_at: true,
  };

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      select: this.userSelectFields,
    });
  }

  async create(
    createUserDto: CreateUserDto,
  ): Promise<User | IDuplicateResponse | undefined> {
    const { password, ...rest } = createUserDto;

    const handelHash = await bcrypt.hash(password, 10);
    try {
      const newUser = this.userRepository.create({
        ...rest,
        password: handelHash,
      });
      return await this.userRepository.save(newUser);
    } catch (error: any) {
      if (
        error.code === 'ER_DUP_ENTRY' ||
        error.errno === 1062 ||
        error.code === '23505'
      ) {
        throw new ConflictException('Email address already exists');
      }

      console.error('User creation failed:', error);
      throw new InternalServerErrorException(
        'An unexpected error occurred while creating the account',
      );
    }
  }

  async findOne(id: number | null, email: string | ''): Promise<User | null> {
    const relatedQuery = id ? { id } : { email };
    const useByQueryBuilder = await this.userRepository.findOne({
      where: relatedQuery,
      select: this.userSelectFields,
    });

    if (useByQueryBuilder) {
      return useByQueryBuilder;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const currentUser = this.userRepository.findOne({ where: { id } });
    if (!currentUser) {
      throw new NotFoundException('User Not Found');
    }
    await this.userRepository.update(id, updateUserDto);

    return currentUser;
  }

  async remove(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }

    return {
      message: 'User deleted successfully',
    };
  }
}
