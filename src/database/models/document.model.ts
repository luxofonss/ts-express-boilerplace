export default interface IDocumentModel {
  readonly id: string;
  readonly userId: string;
  readonly name: string;
  readonly content: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
