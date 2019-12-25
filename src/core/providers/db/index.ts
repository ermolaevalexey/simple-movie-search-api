import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../di';
import EnvProvider from '../env';

export const TStoreProvider = Symbol.for('StoreProvider');

@Injectable()
export class StoreProvider {
    private _store: Sequelize;

    constructor(
        @Inject('EnvProvider') private envProvider: EnvProvider
    ) {
        this._store = this.initStore(this.envProvider.store);
    }

    get store(): Sequelize {
        return this._store;
    }

    private initStore(params: { name: string, user: string, password: string }): Sequelize {
        return new Sequelize(
            params.name,
            params.user,
            params.password,
            {
                dialect: 'postgres',
                models: [__dirname + '../../../../models/**/*.ts'],
                repositoryMode: true,
                logging: this.envProvider.env === 'production'
                    ? undefined
                    : console.log
            }
        );
    }
}
