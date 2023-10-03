export default interface IResetToken {
  readonly id: string;
  readonly token: string;
  readonly expiresAt: Date;
  readonly userId: string;
  readonly createdAt: Date;
}
