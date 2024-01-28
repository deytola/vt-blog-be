import { BadRequestException, Injectable } from '@nestjs/common';
import { UserLoginDTO } from 'src/authorization/DTOs/UserLogin.dto';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/services/users/users.service';

@Injectable()
export class AuthorizationService {
  constructor(
    private userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    userLoginDTO: UserLoginDTO,
  ): Promise<{ token: string; user: User }> {
    const savedUser = await this.userService.findOneByEmail(userLoginDTO.email);
    if (!savedUser) {
      throw new BadRequestException('Invalid credentials');
    }
    if (!(await bcrypt.compare(userLoginDTO.password, savedUser.password))) {
      throw new BadRequestException('Invalid credentials');
    }
    savedUser.lastLoginDate = new Date();
    await savedUser.save();
    delete savedUser.password;
    return {
      token: this.jwtService.sign({
        ...savedUser,
      }),
      user: savedUser,
    };
  }
}
