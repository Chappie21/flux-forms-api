import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { hashSync } from 'bcryptjs';
import { User } from '@prisma/client'
import { CreateUserDto } from './dto'

@Injectable()
export class UserService {
  
  constructor(
    private readonly prisma: PrismaService
  ){}

  async createUser(newUser: CreateUserDto): Promise<User> {
    try {
      const { firstName, lastName, email, password, region = '', registeredFromGoogle } = newUser;
      const hashedPassword = hashSync(password, 10);

      const user: User = await this.prisma.user.create({
        data: {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLocaleLowerCase(),
          password: hashedPassword,
          region,
          registeredFromGoogle: registeredFromGoogle
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('This email is in use, please use another one.');
      }
      console.error('Error creating user:', error);
      throw new InternalServerErrorException('An error occurred while creating the user - Check logs.')
    }

  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { email, deleted: false },
      });
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while fetching the user - Check logs.');
    }
  }

}
