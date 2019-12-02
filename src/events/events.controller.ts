import { Controller, Get, Post, Body, Request, UseGuards, Delete, Res, Query, NotFoundException, HttpStatus, Put } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EventsService } from './events.service';
import { ValidateObjectId } from '../shared/pipes/validate-object-id.pipes';
import { CreateEventDTO } from './dto/create-event.dto';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('all')
  async getAllEvents() {
    return await this.eventsService.getEvents();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('save')
  async saveEvent(@Request() req, @Body() createEventDTO: CreateEventDTO) {
    return await this.eventsService.saveEvent({
      ...createEventDTO,
      creatorId: req.user.userId,
    });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/delete')
  async deleteUser(
    @Res() res,
    @Query('eventID',
      new ValidateObjectId()) eventID,
  ) {
    const { deletedEvent, events } = await this.eventsService.deleteEvent(eventID);
    if (!deletedEvent) { throw new NotFoundException('Event does not exist!'); }
    return res.status(HttpStatus.OK).json(events);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('get')
  async getEvent(
    @Res() res,
    @Query('eventID',
      new ValidateObjectId()) eventID,
  ) {
    const event = await this.eventsService.getEvent(eventID);
    if (!event) { throw new NotFoundException('Event does not exist!'); }
    return res.status(HttpStatus.OK).json(event);
  }

  @Put('/change')
  async changeEvent(
    @Res() res,
    @Query('eventID', new ValidateObjectId()) eventID,
    @Body() createEventDTO: CreateEventDTO,
  ) {
    const editedEvent = await this.eventsService.editEvent(eventID, createEventDTO);
    if (!editedEvent) { throw new NotFoundException('Event does not exist!'); }
    return res.status(HttpStatus.OK).json(editedEvent);
  }
}
