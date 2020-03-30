import { Column, DataType, Model, Table } from 'sequelize-typescript';


@Table({
  tableName: 'movie_directors',
  timestamps: false
})
export default class Director extends Model<Director> {

  @Column({ type: DataType.UUIDV4, primaryKey: true })
  id: string = this.id;

  @Column({ type: DataType.STRING, allowNull: true })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  name: string = this.name;

  @Column({ type: DataType.ARRAY(DataType.UUIDV4) })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  movies: string[] = this.movies;
}

export interface DirectorUpdateParams {
  id: string;
  success: boolean;
}
