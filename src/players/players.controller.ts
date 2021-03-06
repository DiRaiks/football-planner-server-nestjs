import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Post, Put, Query, Request, Res, UseGuards, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreatePlayerDTO } from './dto/create-player.dto';
import { PlayersService } from './players.service';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { EventsController } from '../events/events.controller';

@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllPlayers() {
    return await this.playersService.getPlayers();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  async savePlayer(@Request() req, @Body() createPlayerDTO: CreatePlayerDTO) {
    return await this.playersService.savePlayer(createPlayerDTO);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete')
  async deletePlayerOld(
    @Res() res,
    @Query('playerID',
      new ValidateObjectId()) playerID,
  ) {
    const { deletedPlayer, players, event } = await this.playersService.deletePlayer(playerID);
    if (!deletedPlayer) { throw new NotFoundException('Player does not exist!'); }
    return res.status(HttpStatus.OK).json({ players, event });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete/:playerID')
  async deletePlayer(
    @Res() res,
    @Param('playerID',
      new ValidateObjectId()) playerID,
  ) {
    const { deletedPlayer, players, event } = await this.playersService.deletePlayer(playerID);
    if (!deletedPlayer) { throw new NotFoundException('Player does not exist!'); }
    return res.status(HttpStatus.OK).json({ players, event });
  }

  @Put('/change')
  async changePlayerOld(
    @Res() res,
    @Query('playerID', new ValidateObjectId()) playerID,
    @Body() createPlayerDTO: CreatePlayerDTO,
  ) {
    const editedPlayer = await this.playersService.editPlayer(playerID, createPlayerDTO);
    if (!editedPlayer) { throw new NotFoundException('Player does not exist!'); }
    return res.status(HttpStatus.OK).json(editedPlayer);
  }

  @Put('/change/:playerID')
  async changePlayer(
    @Res() res,
    @Param('playerID', new ValidateObjectId()) playerID,
    @Body() createPlayerDTO: CreatePlayerDTO,
  ) {
    const editedPlayer = await this.playersService.editPlayer(playerID, createPlayerDTO);
    if (!editedPlayer) { throw new NotFoundException('Player does not exist!'); }
    return res.status(HttpStatus.OK).json(editedPlayer);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('byEventId')
  async getPlayersByEventIdOld(
    @Res() res,
    @Query('eventID',
      new ValidateObjectId()) eventID,
  ) {
    const player = await this.playersService.getPlayersByEventId(eventID);
    if (!player) { throw new NotFoundException('Player does not exist!'); }
    return res.status(HttpStatus.OK).json(player);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('byEventId/:eventID')
  async getPlayersByEventId(
    @Res() res,
    @Param('eventID',
      new ValidateObjectId()) eventID,
  ) {
    const player = await this.playersService.getPlayersByEventId(eventID);
    if (!player) { throw new NotFoundException('Player does not exist!'); }
    return res.status(HttpStatus.OK).json(player);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':eventID/:userID')
  async getPlayer(
    @Res() res,
    @Param('eventID',
      new ValidateObjectId()) eventID,
    @Param('userID',
      new ValidateObjectId()) userID,
  ) {
    const players = await this.playersService.getPlayersByEventId(eventID);
    const player = players.find((item) => item.userId === userID);
    if (!player) { throw new NotFoundException('Player does not exist!'); }
    return res.status(HttpStatus.OK).json(player);
  }
}
