export interface IUser {
  id?: string,
  username: string,
  password?: string,
  email: string,
  defaultLocale?: string,
  meta?: any,
}

export interface ICanvas {
  id: string
  userId: string,
  name: string,
  size: number,
  timer: number,
  private: boolean,
  img?: string,
  subs?: string[] | string,
  meta?: any
}