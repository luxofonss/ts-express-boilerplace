export default interface IKeyPairModel {
  readonly id: string;
  readonly encryptedPrivateKey: string;
  readonly publicKey: string;
  readonly userId: string;
}
