import * as Koa from 'koa';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { UserLoginRequest } from './request';
import { ContentTypeKey, Controller, PostRoute } from '../../core/routing/decorators';
import EnvProvider, { TEnvProvider } from '../../core/providers/env';
import { Inject, Injectable } from '../../core/di';
import { TUsersRepository, UsersRepository } from './repository';


export const TUsersController = Symbol.for('UsersController');

@Controller('/auth')
@Injectable()
export class UsersController {

  constructor(
    @Inject(TEnvProvider) private envProvider: EnvProvider,
    @Inject(TUsersRepository) private usersRepository: UsersRepository
  ) {
  }

  @PostRoute('/login', ContentTypeKey.Json, false)
  loginUser = async (ctx: Koa.Context, next: () => Promise<unknown>) => {
    const request: UserLoginRequest = ctx.request.body;
    console.log('login'.toUpperCase(), request.email);

    const user = await this.usersRepository.getUserByEmail(request.email);
    console.log('user', user);
    const isPasswordCorrect = bCrypt.compareSync(request.password, user.password);

    if (!isPasswordCorrect) {
      const err = new Error();
      err.name = 'WrongPasswordError';
      err.message = 'Wrong password is entered';
      throw err;
    }

    const accessToken = jwt.sign({
      type: 'access',
      userEmail: user.email,
      userId: user.id,
      userName: user.name
    }, this.envProvider.authSecret, {
      algorithm: 'HS256',
      expiresIn: '15m'
    });

    const refreshToken = jwt.sign({
      type: 'refresh',
      userId: user.id
    }, this.envProvider.authSecret, {
      algorithm: 'HS256',
      expiresIn: '20m'
    });

    ctx.status = 200;

    ctx.state.data = {
      accessToken,
      userId: user.id
    };

    ctx.cookies.set('refresh', refreshToken, {httpOnly: true});

    await next();
  };
}
