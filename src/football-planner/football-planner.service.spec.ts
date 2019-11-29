import { Test, TestingModule } from '@nestjs/testing';
import { FootballPlannerService } from './football-planner.service';

describe('FootballPlannerService', () => {
  let service: FootballPlannerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FootballPlannerService],
    }).compile();

    service = module.get<FootballPlannerService>(FootballPlannerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
