import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto/users.dto';
import { LoginFirebaseDto } from './dto/login.dto';
import { app } from 'firebase-admin';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject('FIREBASE_APP') private readonly firebaseApp: app.App,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getUserByEmail(email);
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const {  ...result } = user;
        return result;
      }
    }
    return null;
  }

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.sign(payload);
  }

  async login(loginDto: { email: string; password: string }): Promise<{ accessToken: string }> {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const token = await this.generateToken(payload);
    return { accessToken: token };
  }

async loginWithFirebase(data: LoginFirebaseDto): Promise<{ accessToken: string, existingUser?: boolean }> {
  try {
    const { email, firstName, lastName, gender, phoneNumber } = data;

    if (!email) {
      throw new UnauthorizedException('Email is required');
    }

    let user = await this.userService.getUserByEmail(email);
    const isExistingUser = user !== null;
    if (!user) {
      user = await this.userService.createUser({
        email,
        firstName,
        lastName,
        gender,
        phoneNumber,
        password: "string", // Firebase-auth users don't use password
        role: 'user',
      } as CreateUserDto);
    }

    const payload = {
      sub: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const token = await this.generateToken(payload);
    return { accessToken: token, existingUser: isExistingUser };
  } catch (err) {
    console.error(err);
    throw new UnauthorizedException('Login failed');
  }
}




  async register(userDto: CreateUserDto) {
    const user = await this.userService.createUser(userDto);
    return user;
  }

  async getMe(userId: string) {
    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }
}
