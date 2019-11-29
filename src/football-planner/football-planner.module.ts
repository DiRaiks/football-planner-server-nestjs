import { Module } from '@nestjs/common';
import { FootballPlannerService } from './football-planner.service';
import { FootballPlannerController } from './football-planner.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  providers: [FootballPlannerService],
  controllers: [FootballPlannerController],
})
export class FootballPlannerModule {}
