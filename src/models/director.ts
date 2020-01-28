import { Column, DataType, Model, Table } from 'sequelize-typescript';


@Table({
    tableName: 'movie_directors',
    timestamps: false
})
export default class Director extends Model<Director> {

    @Column({ type: DataType.UUIDV4, primaryKey: true })
    id: string = this.id;

    @Column({ type: DataType.STRING, allowNull: true })
    // @ts-ignore
    name: string = this.name;

    @Column({ type: DataType.ARRAY(DataType.UUIDV4) })
    // @ts-ignore
    movies: Array<string> = this.movies;
}

export interface DirectorUpdateParams {
    id: string;
    success: boolean;
}
