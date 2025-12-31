import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { isEmail } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    // private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    let key: keyof User = 'username';

    if (isEmail(username)) key = 'email';

    const user = await this.findByUsername(key, username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.getJwtToken({ id: user.id });

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      token,
    };
  }

  getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  async findByUsername(index: string, value: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { [index]: value },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
      },
      // Seleccionar todos las columnas
      relations: { roles: { role: true }, municipality: true },
    });

    return user;
  }

  async findFullWithId(id: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { roles: { role: true }, municipality: true },
    });
    return user;
  }
}
