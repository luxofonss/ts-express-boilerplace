export default interface IEmailVerificationToken {
  readonly id: string;
  readonly token: string;
  readonly expiresAt: Date;
  readonly userId: string;
  readonly createdAt: Date;
}
