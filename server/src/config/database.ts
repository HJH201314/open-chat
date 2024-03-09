import { MongooseModuleOptions } from '@nestjs/mongoose/dist/interfaces/mongoose-options.interface';

export type MONGO_CONFIG_TYPE = {
  uri: string;
  config: MongooseModuleOptions;
};

export const MONGO_CONFIG = {
  uri: 'mongodb://example.com/',
  config: {
    user: 'root',
    pass: '123456',
    dbName: 'open-chat',
  },
};
