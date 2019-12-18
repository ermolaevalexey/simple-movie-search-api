import * as S from 'sequelize';
import { Model, Op } from 'sequelize';
import { Injectable } from '../core/di';
import { MovieDirectorModel } from './director';


export interface Movie {
    title: string;
    year: number;
    director?: string;
    description?: string;
    posterImage?: string;
}

@Injectable()
export class MovieModel extends Model {
    public id!: string;
    public title!: string;
    public description!: string;
    public year!: number;
    public director!: string;
    private MovieDirectorModel!: MovieDirectorModel;

    static async getMovies(): Promise<Array<Movie>> {
        try {
            const models: Array<MovieModel> = await this.findAll({
                attributes: ['title', 'description', 'year', 'director'],
                include: [{
                    model: MovieDirectorModel,
                    attributes: ['name'],
                    where: { id: { [Op.eq]: S.col('director') } }
                }]
            });

            return models.map(model => ({
                title: model.title,
                year: model.year,
                description: model.description,
                director: model.MovieDirectorModel.name
            }));
        } catch (err) {
            throw err;
        }
    }
}
