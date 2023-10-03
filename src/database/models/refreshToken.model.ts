export default interface IRefreshTokenModel {
  readonly id: string;
  readonly token: string;
  readonly userId: string;
  readonly createdAt?: Date;
}
