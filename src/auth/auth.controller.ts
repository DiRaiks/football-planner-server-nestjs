import { Body, Controller, Get, Post, Request, Res, UseGuards, HttpStatus } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('registration')
  async registration(@Body() body, @Res() res) {
    try {
      return await this.authService.registration(body);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('checkToken')
  async checkToken(@Request() req) {
    return req.user;
  }
}
