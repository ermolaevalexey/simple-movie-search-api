import { Column, Model, Table, DataType, ForeignKey, IsUUID } from 'sequelize-typescript';
import Director from './director';


@Table({
    tableName: 'movies',
    timestamps: false
})
export default class Movie extends Model<Movie> {

    @IsUUID(4)
    @Column({ type: DataType.UUIDV4, primaryKey: true })
    id: string = this.id;

    @Column({ type: DataType.STRING, allowNull: true })
    // @ts-ignore
    title: string = this.title;

    @Column({ type: DataType.INTEGER, allowNull: false })
    // @ts-ignore
    year: number = this.year;

    @Column({ type: DataType.STRING, allowNull: true })
    // @ts-ignore
    description: string = this.description;

    @ForeignKey(() => Director)
    @Column({ type: DataType.UUIDV4, allowNull: true })
    // @ts-ignore
    director: string = this.director;
}

export interface MovieParams {
    id: string;
    title: string;
    year: string;
    description: string;
    director: string;
}
