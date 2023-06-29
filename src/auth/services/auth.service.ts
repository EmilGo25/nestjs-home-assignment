import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from '../../user/interface/user.interface';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { errorCodes } from '../../common/error-codes.enum';
import { JwtPayload } from '../jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<IUser>,
    private jwtService: JwtService,
  ) {}

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async signUp({ username, password }: AuthCredentialsDto): Promise<IUser> {
    const user = await this.userModel.findOne({ username }).exec();
    console.log('user', user);
    if (user) {
      throw new ConflictException('Username already exists');
    }

    const newUserProps: any = {};
    newUserProps.username = username;
    newUserProps.salt = await bcrypt.genSalt();
    newUserProps.password = await this.hashPassword(
      password,
      newUserProps.salt,
    );

    console.log('newUserProps', newUserProps);
    try {
      const newUser = await new this.userModel(newUserProps);
      return newUser.save();
    } catch (e) {
      switch (e.code) {
        case errorCodes.DUPLICATE_ASSET:
          throw new ConflictException('Username already exists');
        default:
          throw new InternalServerErrorException();
      }
    }
  }

  async validateUserPassword({
    username,
    password,
  }: AuthCredentialsDto): Promise<string> {
    const user: any = await this.userModel.findOne({ username }).exec();
    console.log('user!!', user);
    const hash = await bcrypt.hash(password, user.salt);

    if (user && hash === user.password) {
      return user.username;
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const result = await this.validateUserPassword({ username, password });
    console.log('result', result);
    const payload: JwtPayload = { username };
    console.log('payload', payload);
    const accessToken = this.jwtService.sign(payload, { secret: 'Cymulate' });

    return { accessToken };
  }
}
