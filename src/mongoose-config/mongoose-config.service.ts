import { Injectable } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import { MongooseOptionsFactory, MongooseModuleOptions } from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  private readonly user: string;
  private readonly password: string;
  private readonly databaseName: string;

  constructor(config: ConfigService) {
    this.user = config.databaseUser;
    this.password = config.databasePassword;
    this.databaseName = config.databaseName;
  }

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: `mongodb+srv://${ this.user }:${ this.password }@cluster0-nuyru.mongodb.net/${ this.databaseName }?retryWrites=true&w=majority`,
      useNewUrlParser: true,
      useFindAndModify: false,
    };
  }
}
