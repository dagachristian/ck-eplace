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
  creator: string,
  name: string,
  size: number,
  timer: number,
  private: boolean,
  img?: string,
  subs?: string[],
  meta?: any
  created?: string
}

export interface ICanvasResult {
  id: string
  userId: string,
  username: string,
  name: string,
  size: number,
  timer: number,
  private: boolean,
  img?: string,
  subs?: string,
  meta?: any
  created?: string
}

export interface IFilters {
  query: string,
  user: string,
  subbed: string,
  sortBy: 'size' | 'created' | 'name' | 'subs' | string,
  sortByOrder: 'asc' | 'desc' | string,
  page: number
}