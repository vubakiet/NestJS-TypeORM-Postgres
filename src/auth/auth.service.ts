import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRegister } from './validate-models/user-register.model';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { UserLogin } from './validate-models/user-login.model';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,

    private jwtService: JwtService,
  ) {}

  async register(userRegister: UserRegister) {
    const {
      firstname,
      lastname,
      birthday,
      address,
      username,
      password,
      permission,
    } = userRegister;
    const date = new Date();
    const time = date.getTime();

    const user = await this.usersRepository.findOne({
      where: {
        username: userRegister.username,
      },
    });

    if (user) {
      throw new BadRequestException('User da ton tai');
    }

    const userAdd = await this.usersRepository.create({
      firstname: firstname,
      lastname: lastname,
      birthday: birthday,
      address: address,
      username: username,
      password: password,
      permission: permission,
      access_token: 'token' + time,
    });

    const dateConvert = new Date().getTime() - new Date('2005-05-20').getTime();

    console.log(dateConvert * 3.168809e-11);

    const strs = userAdd.birthday.split(/[-/]+/);
    const dayOfBirth: number = parseInt(strs[0]);
    const monthOfBirth: number = parseInt(strs[1]);
    const yearOfBirth: number = parseInt(strs[2]);

    // console.log(monthOfBirth);
    // console.log(date.getMonth() + 1);

    if (userAdd) {
      if (date.getFullYear() - yearOfBirth >= 18) {
        if (monthOfBirth < date.getMonth() + 1) {
          if (dayOfBirth < date.getDate()) {
            await this.usersRepository.save(userAdd);
          } else {
            return 'Chua du 18 tuoi';
          }
        } else {
          return 'Chua du 18 tuoi';
        }
      } else {
        return 'Chua du 18 tuoi';
      }
    }

    return userAdd;
  }

  async login(userLogin: UserLogin) {
    const user = await this.usersRepository.findOne({
      where: {
        username: userLogin.username,
      },
    });

    if (!user || user.password !== userLogin.password) {
      return {
        message: 'Username or password is incorrect',
      };
    }

    const payload = { username: (await user).username, sub: (await user).id };
    const access_token = await this.jwtService.signAsync(payload);

    await this.usersRepository.update(
      { id: user.id },
      {
        access_token,
      },
    );

    return { access_token };
  }
}
