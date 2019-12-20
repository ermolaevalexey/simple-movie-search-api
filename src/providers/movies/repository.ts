import { Sequelize } from 'sequelize-typescript';
import { Inject, Injectable } from '../../core/di';
import { StoreProvider, TStoreProvider } from '../db';
import Movie from '../db/models/movie';


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

    private get store(): Sequelize {
        return this.storeProvider.store;
    }
}
