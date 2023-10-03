export default interface IAccountModel {
  readonly id: string;
  readonly userId: string;
  readonly type: string;
  readonly provider: string;
  readonly providerAccountId: string;
  readonly refreshToken?: string;
  readonly accessToken: string;
  readonly expiresAt: Date;
  readonly tokenType: string;
  readonly scope: string;
  readonly idToken?: string;
  readonly sessionState?: string;
}
