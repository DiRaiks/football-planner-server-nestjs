export class CreateEventDTO {
  readonly place: string;
  readonly time: string;
  readonly date: string;
  readonly minimum: number;
  readonly playersAmount: number;
  readonly eventName: string;
  readonly creatorId: string;
}
