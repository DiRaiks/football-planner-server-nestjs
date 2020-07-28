export interface Weather {
  readonly lat: string;
  readonly lon: string;
  readonly timezone: string;
  readonly timezone_offset: number;
  readonly current: Current;
  readonly daily: Daily[];
}

interface Current {
  dt: number;
  temp: number;
  weather: Info;
}

interface Info {
  id: number;
  main: string;
  description: string;
  icon: string;
}

interface Daily {
  dt: number;
  temp: DailyTemp;
  weather: Info;
}

interface DailyTemp {
  day: number;
  min: number;
  max: number;
  night: number;
  eve: number;
  morn: number;
}
