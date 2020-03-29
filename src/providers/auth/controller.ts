import * as Koa from 'koa';
import * as bCrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Inject, Injectable } from '../../core/di';
import EnvProvider, { TEnvProvider } from '../../core/providers/env';
import { ContentTypeKey, Controller, PostRoute } from '../../core/routing/decorators';
import { TUsersRepository, UsersRepository } from './repository';
import { UserLoginRequest } from './request';


export const TUsersController = Symbol.for('UsersController');

@Controller('/auth')
@Injectable()
export class UsersController {

    constructor(
        @Inject(TEnvProvider) private envProvider: EnvProvider,
        @Inject(TUsersRepository) private usersRepository: UsersRepository
    ) {}

    @PostRoute('/login', ContentTypeKey.Json, false)
    loginUser = async (ctx: Koa.Context, next: Function) => {
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
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            type: 'access'
        }, this.envProvider.authSecret, {
            algorithm: 'HS256',
            expiresIn: '15m'
        });

        const refreshToken = jwt.sign({
            userId: user.id,
            type: 'refresh'
        }, this.envProvider.authSecret, {
            algorithm: 'HS256',
            expiresIn: '20m'
        });

        ctx.status = 200;

        ctx.state.data = {
            userId: user.id,
            accessToken
        };

        ctx.cookies.set('refresh', refreshToken, { httpOnly: true });

        await next();
    };
}
