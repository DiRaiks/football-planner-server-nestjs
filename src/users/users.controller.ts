import { Body, Controller, Post, Request, UseGuards, Get, Res, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('change')
  async changeUser(@Request() req, @Body() body) {
    return await this.usersService.editUser(req.user.userId, body);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('userEventsCount/:userId')
  async getUserEventsCount(
    @Param('userId',
      new ValidateObjectId()) userID,
  ) {
    return await this.usersService.getUserEventsCount(userID);
  }
}
