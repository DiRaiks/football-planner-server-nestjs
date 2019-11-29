import { Controller, Get, Res, HttpStatus, Param,
  NotFoundException, Post, Body, Query, Put, Delete } from '@nestjs/common';
import { FootballPlannerService } from './football-planner.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';

@Controller('football-planner')
export class FootballPlannerController {
  constructor(private footballPlannerService: FootballPlannerService) { }

  @Get('users')
  async getUsers(@Res() res) {
    const users = await this.footballPlannerService.getUsers();
    return res.status(HttpStatus.OK).json(users);
  }

  @Get('user/:userID')
  async getUser(@Res() res, @Param('userID', new ValidateObjectId()) userID) {
    const user = await this.footballPlannerService.getUser(userID);
    if (!user) { throw new NotFoundException('User does not exist!'); }
    return res.status(HttpStatus.OK).json(user);
  }

  @Post('/user')
  async addUser(@Res() res, @Body() createUserDTO: CreateUserDTO) {
    const newUser = await this.footballPlannerService.addUser(createUserDTO);
    return res.status(HttpStatus.OK).json({
      message: 'User has been submitted successfully!',
      post: newUser,
    });
  }

  @Put('/edit')
  async editUser(
    @Res() res,
    @Query('userID', new ValidateObjectId()) userID,
    @Body() createUserDTO: CreateUserDTO,
  ) {
    const editedUser = await this.footballPlannerService.editUser(userID, createUserDTO);
    if (!editedUser) { throw new NotFoundException('Post does not exist!'); }
    return res.status(HttpStatus.OK).json({
      message: 'Post has been successfully updated',
      post: editedUser,
    });
  }

  @Delete('/delete')
  async deleteUser(
    @Res() res,
    @Query('userID',
    new ValidateObjectId()) userID,
  ) {
    const deletedUser = await this.footballPlannerService.deleteUser(userID);
    if (!deletedUser) { throw new NotFoundException('Post does not exist!'); }
    return res.status(HttpStatus.OK).json({
      message: 'Post has been deleted!',
      post: deletedUser,
    });
  }
}
