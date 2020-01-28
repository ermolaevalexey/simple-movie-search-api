import * as fs from 'fs';
import { MongoClient, Db, GridFSBucket, connect, GridFSBucketReadStream } from 'mongodb';
import { Inject, Injectable } from '../../di';
import EnvProvider, { TEnvProvider } from '../env';


export const TStaticStorageProvider = Symbol.for('StaticStorageProvider');

@Injectable()
export class StaticStorageProvider {

    private db!: Db;

    constructor(@Inject(TEnvProvider) private envProvider: EnvProvider) {
        this.init().then(() => console.log(this.db));
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

    uploadFile(fileName: string, bucketName: string, data: any): void {
        const bucket = new GridFSBucket(this.db, { bucketName });
        const source = fs.createReadStream(data.path);
        const target = bucket.openUploadStream(fileName, {
            contentType: data.type
        });

        source.pipe(target);
    }

    async getFile(fileName: string, bucketName: string): Promise<{ source: GridFSBucketReadStream | null, ext: string, found: boolean }> {
        const bucket = new GridFSBucket(this.db, { bucketName });
        try {
            const fileObj = await this.db
                .collection(`${bucketName}.files`)
                .findOne({ filename: fileName });

            const source = bucket.openDownloadStreamByName(fileName);
            return { source, ext: fileObj.contentType, found: true };
        } catch (err) {
            return {
                source: null,
                ext: '',
                found: false
            };
        }
    }

    async deleteFile(fileName: string, bucketName: string): Promise<void> {
        const bucket = new GridFSBucket(this.db, { bucketName });
        try {
            const fileObj = await this.db
                .collection(`${bucketName}.files`)
                .findOne({ filename: fileName });

            bucket.delete(fileObj._id, (err) => {
                throw err;
            });
        } catch (err) {
            console.error(err);
            return;
        }
    }
}
