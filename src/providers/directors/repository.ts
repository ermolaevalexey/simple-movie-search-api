import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../../core/providers/db';
import Director, { DirectorParams } from '../../models/director';


@Injectable()
export class DirectorsRepository {

    private directorsRepository = this.store.getRepository(Director);

    constructor(
        @Inject(TStoreProvider) private storeProvider: StoreProvider
    ) {}


    async getAll(): Promise<Array<any>> {
        try {
            return await this.directorsRepository.findAll();
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async getItem(id: string): Promise<any> {
        try {
            return await this.directorsRepository.findByPk(id);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async createItem(params: Partial<DirectorParams>): Promise<DirectorParams> {
        return await this.directorsRepository.create(
            params, { fields: Object.keys(params)
        });
    }

    async updateItem(id: string, params: Partial<DirectorParams>): Promise<boolean> {
        const [ updated ] = await this.directorsRepository.update(
            params,
            {
                where: { id },
                fields: Object.keys(params)
            }
        );

        return Boolean(updated);
    }

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
