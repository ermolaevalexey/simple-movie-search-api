import { Sequelize } from 'sequelize-typescript';
import EnvProvider, { TEnvProvider } from '../env';
import { Inject, Injectable } from '../../di';

export const TStoreProvider = Symbol.for('StoreProvider');

@Injectable()
export class StoreProvider {
  private _store: Sequelize;

  constructor(
    @Inject(TEnvProvider) private envProvider: EnvProvider
  ) {
    // eslint-disable-next-line no-underscore-dangle
    this._store = this.initStore(this.envProvider.dbUrl);
  }

  get store(): Sequelize {
    // eslint-disable-next-line no-underscore-dangle
    return this._store;
  }

  private initStore(dbUrl: string): Sequelize {
    return new Sequelize(dbUrl,
      {
        dialect: 'postgres',
        logging: this.envProvider.env === 'production'
          ? undefined
          : console.log,
        models: [__dirname + '../../../../models/**/*.ts'],
        repositoryMode: true
      }
    );
  }
}
