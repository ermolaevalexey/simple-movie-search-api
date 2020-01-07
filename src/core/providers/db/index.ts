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

    private initStore(params: { dbname: string, user: string, password: string, host: string, port: number }): Sequelize {
        console.log(JSON.stringify(params));
        return new Sequelize(process.env.DATABASE_URL as string,
            // params.dbname,
            // params.user,
            // params.password,
            {
                // host: params.host,
                // port: params.port,
                // protocol: 'postgres',
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
