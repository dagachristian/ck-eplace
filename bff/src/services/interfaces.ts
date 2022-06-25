export interface IUser {
  id?: string,
  username: string,
  password?: string,
  email: string,
  created: Date, 
  createdBy: string,
  lastModified: Date,
  lastModifiedBy: string
}