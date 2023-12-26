export class GrammyUserError extends Error {
  constructor(public readonly message: string) {
    super(message);
  }
}
