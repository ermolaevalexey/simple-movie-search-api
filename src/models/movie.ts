import Director from './director';
import { Column, DataType, ForeignKey, IsUUID, Model, Table } from 'sequelize-typescript';


@Table({
  tableName: 'movies',
  timestamps: false
})
export default class Movie extends Model<Movie> {

  @IsUUID(4)
  @Column({ type: DataType.UUIDV4, primaryKey: true })
  id: string = this.id;

  @Column({ type: DataType.STRING, allowNull: true })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  title: string = this.title;

  @Column({ type: DataType.INTEGER, allowNull: false })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  year: number = this.year;

  @Column({ type: DataType.STRING, allowNull: true })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  description: string = this.description;

  @ForeignKey(() => Director)
  @Column({ type: DataType.UUIDV4, allowNull: true })
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore
  director: string = this.director;
}
