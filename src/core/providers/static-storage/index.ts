import * as fs from 'fs';
import { Db, GridFSBucket, GridFSBucketReadStream, connect } from 'mongodb';
import EnvProvider, { TEnvProvider } from '../env';
import { Inject, Injectable } from '../../di';


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
          password: this.envProvider.mongoDbPassword,
          user: this.envProvider.mongoDbUser
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

  // eslint-disable-next-line max-len
  async getFile(
    fileName: string, bucketName: string
  ): Promise<{ source: GridFSBucketReadStream | null; ext: string; found: boolean }> {
    const bucket = new GridFSBucket(this.db, { bucketName });
    try {
      const fileObj = await this.db
        .collection(`${bucketName}.files`)
        .findOne({ filename: fileName });

      const source = bucket.openDownloadStreamByName(fileName);
      return { source, ext: fileObj.contentType, found: true };
    } catch (err) {
      return {
        ext: '',
        found: false,
        source: null
      };
    }
  }

  async deleteFile(fileName: string, bucketName: string): Promise<void> {
    const bucket = new GridFSBucket(this.db, { bucketName });
    try {
      const fileObj = await this.db
        .collection(`${bucketName}.files`)
        .findOne({ filename: fileName });

      // eslint-disable-next-line no-underscore-dangle
      bucket.delete(fileObj._id, err => {
        throw err;
      });
    } catch (err) {
      console.error(err);
      return;
    }
  }
}
