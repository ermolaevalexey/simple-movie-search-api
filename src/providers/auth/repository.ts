import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../../core/providers/db';
import User from '../../models/auth/user';


export const TUsersRepository = Symbol.for('UsersRepository');

@Injectable()
export class UsersRepository {

    private usersRepository = this.store.getRepository(User);

    constructor(
        @Inject(TStoreProvider) private storeProvider: StoreProvider
    ) {}

    async getUserById(id: string): Promise<User> {
        return this.usersRepository.findByPk(id);
    }

    async getUserByEmail(email: string): Promise<User> {
        try {
            const user = await this.usersRepository.findOne({
                where: {
                    email
                }
            });
            return user;
        } catch (err) {
            const error = err;
            error.name = 'UserNotFoundError';
            error.message = `User with email ${email} does not exist!`;
            throw error;
        }
    }

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
