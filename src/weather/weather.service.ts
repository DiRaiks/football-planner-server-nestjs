import { Injectable, HttpService } from '@nestjs/common';
import { Weather } from './interfaces/weather.interface';

@Injectable()
export class WeatherService {
  constructor(private httpService: HttpService) {}

  async getWeather(): Promise<Weather> {
    const weather = await this.httpService.get('https://api.openweathermap.org/data/2.5/onecall' +
      '?lat=47.222531&lon=39.718705&exclude=minutely,hourly&appid=da58e8be9d2780499a34927e283b3378&units=metric').toPromise();

    return weather.data;
  }
}
