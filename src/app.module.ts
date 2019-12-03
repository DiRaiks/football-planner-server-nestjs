import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { EventsModule } from './events/events.module';
import { PlayersModule } from './players/players.module';

const uri = 'mongodb+srv://dirai:123123qwe@cluster0-nuyru.mongodb.net/football-dev?retryWrites=true&w=majority';

@Module({
  imports: [
    MongooseModule.forRoot(uri, { useNewUrlParser: true, useFindAndModify: false }),
    AuthModule,
    UsersModule,
    EventsModule,
    PlayersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
