import { Test, TestingModule } from '@nestjs/testing';
import { FootballPlannerController } from './football-planner.controller';

describe('FootballPlanner Controller', () => {
  let controller: FootballPlannerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FootballPlannerController],
    }).compile();

    controller = module.get<FootballPlannerController>(FootballPlannerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
