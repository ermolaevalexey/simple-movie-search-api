import * as fs from 'fs';
import { MongoClient, Db, GridFSBucket, connect, GridFSBucketReadStream } from 'mongodb';
import { Inject, Injectable } from '../../di';
import EnvProvider, { TEnvProvider } from '../env';


export const TStaticStorageProvider = Symbol.for('StaticStorageProvider');

@Injectable()
export class StaticStorageProvider {
    // private connection: Connection | null = null;
    // private gridFs: Grid.Grid | null = null;

    private db!: Db;

    constructor(@Inject(TEnvProvider) private envProvider: EnvProvider) {
        this.init().then(() => console.log(this.db));
        // this.connection = createConnection(
        //     this.envProvider.mongoDbUrl,
        //     {
        //         dbName: this.envProvider.mongoDbName,
        //         user: this.envProvider.mongoDbUser,
        //         pass: this.envProvider.mongoDbPassword,
        //         keepAlive: true
        //     }
        // );
        //
        //
        //
        // this.connection.once('open', () => {
        //     this.gridFs = Grid(this.connection!.db, mongo)
        // })
    }

    async init(): Promise<void> {
        const client = await connect(this.envProvider.mongoDbUrl,
            {
                auth: {
                    user: this.envProvider.mongoDbUser,
                    password: this.envProvider.mongoDbPassword
                }
            }
        );

        if (client.isConnected()) {
            this.db = client.db(this.envProvider.mongoDbName);
        }
    }

    uploadFile(fileName: string, bucketName: string, data: any): any {
        console.log('uploading file to bucket...');
        const bucket = new GridFSBucket(this.db, { bucketName });
        const source = fs.createReadStream(data.path);
        const target = bucket.openUploadStream(fileName, {
            contentType: data.type
        });

        source.pipe(target);
    }

    async getFile(fileName: string, bucketName: string): Promise<{ source: GridFSBucketReadStream, ext: string }> {
        console.log('downloading file from bucket...');
        const bucket = new GridFSBucket(this.db, { bucketName });
        const fileObj = await this.db.collection('posters.files').findOne({ filename: fileName });
        console.log(fileObj);
        const file = bucket.find({ filename: fileName });
        // const source = bucket.openDownloadStreamByName(fileName);
        console.log(file);
        const source = bucket.openDownloadStreamByName(fileName);
        console.log(source);
        return { source, ext: fileObj.contentType };
        // const file = await this.gridFs!.files.findOne({ filename: fileName });
        // return file;
    }
}
