import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

export type AppMongoConfig = {
  uri: string;
  config: MongooseModuleOptions;
};

export const MONGO_CONFIG: AppMongoConfig = {
  uri: 'mongodb://example.com/',
  config: {
    user: 'root',
    pass: '123456',
    dbName: 'open-chat',
  },
};
