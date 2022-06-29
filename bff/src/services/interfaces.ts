export interface IUser {
  id?: string,
  username: string,
  password?: string,
  email: string,
  created?: Date, 
  createdBy?: string,
  lastModified?: Date,
  lastModifiedBy?: string
}

export interface IUserInfo {
  username: string,
  password: string,
  ip: string,
  userAgent: string
}

export interface ISession {
  id: string
  userId: string,
  address: string,
  userAgent: string,
  expire: moment.Moment,
}