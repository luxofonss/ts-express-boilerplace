export default interface IUserModel {
  id: string;
  name: string;
  email: string | null;
  password: string;
  emailVerified?: string | Date | null;
  createdAt: string | Date;
}
