import Director from '../../models/director';
import { DirectorParams } from './request';
import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../../core/providers/db';


export const TDirectorsRepository = Symbol.for('DirectorsRepository');

@Injectable()
export class DirectorsRepository {

  private directorsRepository = this.store.getRepository(Director);

  constructor(
    @Inject(TStoreProvider) private storeProvider: StoreProvider
  ) {}


  async getAll(): Promise<Director[]> {
    return await this.directorsRepository.findAll();
  }

  async getItem(id: string): Promise<Director> {
    return await this.directorsRepository.findByPk(id);
  }

  async createItem(params: Partial<DirectorParams>): Promise<DirectorParams> {
    return await this.directorsRepository.create(
      params, { fields: Object.keys(params)
      });
  }

  async updateItem(id: string, params: Partial<DirectorParams>): Promise<boolean> {
    const fields = Object.keys(params).filter(f => Boolean(params[f as keyof DirectorParams]));

    if (!fields.length) {
      return true;
    }

    const [ updated ] = await this.directorsRepository.update(
      params,
      {
        fields,
        where: { id }
      }
    );

    return Boolean(updated);
  }

  private get store(): Sequelize {
    return this.storeProvider.store;
  }
}
