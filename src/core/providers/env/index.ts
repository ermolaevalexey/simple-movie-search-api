import { Injectable } from '../../di';
import '../../config/env';

export const TEnvProvider = Symbol.for('EnvProvider');

@Injectable()
export default class EnvProvider {
  env = process.env.NODE_ENV as string;
  appPort = parseInt(process.env.PORT as string, 10);
  dbUrl = process.env.DATABASE_URL as string;
  authSecret = process.env.AUTH_SECRET as string;

  mongoDbUrl = process.env.MONGO_DB_URL as string;
  mongoDbName = process.env.MONGO_DB_NAME as string;
  mongoDbUser = process.env.MONGO_DB_USER as string;
  mongoDbPassword = process.env.MONGO_DB_PASSWORD as string;
}
