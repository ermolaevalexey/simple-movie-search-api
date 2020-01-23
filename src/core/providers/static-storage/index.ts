import * as fs from 'fs';
import { createConnection, Connection, mongo } from 'mongoose';
import * as Grid from 'gridfs-stream';
import { Inject, Injectable } from '../../di';
import EnvProvider, { TEnvProvider } from '../env';


export const TStaticStorageProvider = Symbol.for('StaticStorageProvider');

@Injectable()
export class StaticStorageProvider {
    private connection: Connection | null = null;
    private gridFs: Grid.Grid | null = null;

    constructor(@Inject(TEnvProvider) private envProvider: EnvProvider) {
        this.connection = createConnection(
            this.envProvider.mongoDbUrl,
            {
                dbName: this.envProvider.mongoDbName,
                user: this.envProvider.mongoDbUser,
                pass: this.envProvider.mongoDbPassword,
                keepAlive: true
            }
        );

        this.connection.once('open', () => {
            this.gridFs = Grid(this.connection!.db, mongo)
        })
    }


    uploadFile(fileName: string, collection: string, data: any): any {
        console.log('uploading file to gfs...');
        const source = fs.createReadStream(data.path);
        const target = this.gridFs!.createWriteStream({
            filename: fileName + data.name.slice(-4),
            mode: 'w',
            content_type: data.type,
            root: collection
        });

        source.pipe(target);
    }

    async getFile(fileName: string, collection: string): Promise<any> {
        const file = await this.gridFs!.files.findOne({ filename: fileName });
        return file;
    }
}
