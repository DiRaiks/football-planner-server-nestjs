import { Body, Controller, Get, Post, Request, Res, UseGuards, HttpStatus, Headers } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

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
      const registeredUser = await this.authService.registration(body);
      return res.status(HttpStatus.OK).json(registeredUser);
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json(error);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('check')
  async checkToken(@Request() req, @Headers() head) {
    const { email, name, _id } = await this.usersService.getUser(req.user.email);
    return { email, name, _id, token: this.jwtService.sign(req.user) };
  }
}
