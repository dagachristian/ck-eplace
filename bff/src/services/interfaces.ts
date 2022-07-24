export interface IUser {
  id?: string,
  username: string,
  password?: string,
  email: string,
  enabled?: boolean,
  defaultLocale: string,
  meta?: any,
  created?: Date | moment.Moment, 
  createdBy?: string,
  lastModified?: Date | moment.Moment,
  lastModifiedBy?: string
}

export interface IUserInfo {
  username: string,
  password: string,
  ip: string,
  userAgent: string
}

export interface ICanvas {
  id: string
  userId: string,
  name: string,
  size: number,
  timer: number,
  private: boolean,
  img?: string,
  subs?: string[],
  meta?: any,
  created?: Date | moment.Moment, 
  createdBy?: string,
  lastModified?: Date | moment.Moment,
  lastModifiedBy?: string
}

export interface ICanvasSub {
  userId: string,
  canvasId: string
}

export interface ICanvasInfo {
  name?: string,
  size?: number,
  timer?: number,
  private?: boolean,
  subs?: string[]
}