import { CreateFriendDto } from './create-friend.dto';

export class CreatePlayerDTO {
  readonly friends: CreateFriendDto[];
  readonly name: string;
  readonly date: string;
  readonly status: boolean;
  readonly eventId: string;
  readonly userId: string;
}
