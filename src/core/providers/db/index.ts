import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../di';
import EnvProvider, { TEnvProvider } from '../env';

export const TStoreProvider = Symbol.for('StoreProvider');

@Injectable()
export class StoreProvider {
    private _store: Sequelize;

    constructor(
        @Inject(TEnvProvider) private envProvider: EnvProvider
    ) {
        this._store = this.initStore(this.envProvider.dbUrl);
    }

    get store(): Sequelize {
        return this._store;
    }

    private initStore(dbUrl: string): Sequelize {
        return new Sequelize(dbUrl,
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
