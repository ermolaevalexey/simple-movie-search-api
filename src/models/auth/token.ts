import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
    tableName: 'users_tokens',
    timestamps: false
})
export default class Token extends Model<Token> {

    @Column({
        type: DataType.UUIDV4,
        primaryKey: true,
        references: {
            model: 'User',
            key: 'id'
        }
    })
    userId: string = this.id;

    @Column({ type: DataType.STRING })
    accessToken: string | null = null;

    @Column({ type: DataType.STRING })
    refreshToken: string | null = null;
}
