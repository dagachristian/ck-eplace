export interface IContactInfo {
  name: string
  email: string
}

export enum LogErrorStatus {
  OK = 'OK',
  ERROR = 'ERROR'
}

export enum HealthStatus {
  UP = 'UP',
  DOWN = 'DOWN',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE',
  UNKNOWN = 'UNKNOWN'
}

export interface IHealthStatus {
  status: HealthStatus
  components?: {
    [serviceName: string]: IHealthStatus
  }
  details?: any
}

export interface ILogGroup {
  awsAccount: string
  awsRegion: string
  logGroupName: string
  logGroupLink?: string
  logErrorStatus?: LogErrorStatus
  lastLogEventsWithErrorsTS?: string
  lastUpdateTS: string
  serviceName: string
  logGroupId: string
}

export interface IService {
  serviceName: string
  contactInfo?: IContactInfo
  team?: string
  logErrorStatus?: LogErrorStatus
  lastLogEventsWithErrorsTS?: string
  healthStatus: IHealthStatus
  lastHealthTS?: string
  lastUpdateTS: string
}

export interface ILogEvent {
  id: string
  timestamp: number
  message: string
}

export interface ILogEventsGroup {
  logGroupId: string
  logStreamName: string
  logStreamLink?: string
  logEvents: ILogEvent[]
  lastLogEventTS: string
  lastErrorTS?: string
  lastUpdateTS: string
}

export interface IUser {
  email: string
  showServices?: string[]
  lastUpdateTS: string
}

export interface IConnection {
  email: string
  connectionId: string
  createdTS: string
}
