export class CreateUserDTO {
  readonly email: string;
  readonly name: string;
  readonly hash: string;
  readonly salt: string;
}
