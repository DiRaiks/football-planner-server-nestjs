import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { FootballPlannerModule } from './football-planner/football-planner.module';

const uri = 'mongodb+srv://dirai:123123qwe@cluster0-nuyru.mongodb.net/football-dev?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(uri, { useNewUrlParser: true }),
    FootballPlannerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
