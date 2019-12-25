import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../../core/providers/db';
import Movie from '../../models/movie';


@Injectable()
export class MoviesRepository {

    private moviesRepository = this.store.getRepository(Movie);

    constructor(
        @Inject(TStoreProvider) private storeProvider: StoreProvider
    ) {}

    async getAll(): Promise<Array<Movie>> {
        try {
            return await this.moviesRepository.findAll();
        } catch (err) {
            console.error(err);
            return [];
        }
    }

    async getItem(id: string): Promise<Movie | null> {
        try {
            return await this.moviesRepository.findByPk(id);
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async createItem(params: any): Promise<Movie | null> {
        try {
            return await this.moviesRepository.create(
                params, { fields: Object.keys(params) }
            );
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async updateItem(id: string, params: any): Promise<Movie | null> {
        try {
            return await this.moviesRepository.update(
                params,
                {
                    where: { id },
                    fields: Object.keys(params)
                }
            );
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    async deleteItem(id: string): Promise<Movie | null> {
        try {
            return await this.moviesRepository.destroy(
                { where: { id } }
            );
        } catch (err) {
            console.error(err);
            return null;
        }
    }

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
