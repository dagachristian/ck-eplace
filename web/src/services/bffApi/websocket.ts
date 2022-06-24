import { Auth } from 'aws-amplify';
import { bffApi } from '.';
import { ILogGroup, IService } from '../../interfaces';
import { useLogGroupStore, LogGroupState, addLogGroups } from '../state/logGroups';
import { useServiceStore } from '../state/services';

interface IEvent {
  eventType: string,
  service?: IService,
  logGroup?: ILogGroup
}

export class BffSocket {
  private readonly reconnectAttempts: number;
  private attempt: number;
  private lastEvent: string | undefined;
  public socket: WebSocket | undefined;

  constructor(attempts?: number) {
    this.reconnectAttempts = attempts || 50;
    this.lastEvent = undefined;
    this.socket = undefined;
    this.attempt = 0;
  }

  async initSocket() {
    try {
      const toks = await getTok();
      console.log(toks)
      this.socket = new WebSocket(`${process.env.REACT_APP_WEBSOCKET_URL!}?idToken=${toks?.idToken}`)
      this.socket.onopen = async (event: any) => {
        console.log('websocket opened');
        this.attempt = 0;
        if (this.lastEvent) {
          const newServices = (await bffApi.getServices(toks?.apiToken!, this.lastEvent)) || {services: []};
          useServiceStore.setState({...useServiceStore.getState(), services: [...(useServiceStore.getState().services || []), ...newServices.services]})
          Object.keys(useLogGroupStore.getState().logGroups).forEach(async (svcName) => {
            const newLogGroups = (await bffApi.getLogGroups(svcName, toks?.apiToken!, this.lastEvent)) || {logGroups: []};
            const temp: LogGroupState = addLogGroups(useLogGroupStore.getState().logGroups, newLogGroups.logGroups, svcName)
            useLogGroupStore.setState({...useLogGroupStore.getState(), logGroups: {...temp}})
          })
        }
      }
      this.socket.onerror = (err: any) => {
        console.log('websocket error');
        this.socket?.close()
      }
      this.socket.onmessage = (event: MessageEvent) => {
        console.log(event.data);
        this.lastEvent = new Date().toISOString();
        JSON.parse(event.data).events.forEach((ev: IEvent) => {
          switch(ev.eventType) {
            case 'CREATE': 
              if (ev.service) {
                useServiceStore.setState({...useServiceStore.getState(), services: [...(useServiceStore.getState().services || []), ev.service]})
              } else if (ev.logGroup) {
                if (useLogGroupStore.getState().logGroups[ev.logGroup.serviceName]) {
                  const temp: LogGroupState = addLogGroups(useLogGroupStore.getState().logGroups, [ev.logGroup], ev.logGroup.serviceName)
                  useLogGroupStore.setState({...useLogGroupStore.getState(), logGroups: {...temp}})
                }
              }
            break;
            case 'DELETE':
              if (ev.service) {
                useServiceStore.setState({
                  ...useLogGroupStore.getState(),
                  services: [...(useServiceStore.getState().services?.filter((s) => s.serviceName !== ev.service?.serviceName) || [])]
                })
              } else if (ev.logGroup) {
                const temp: LogGroupState = {...useLogGroupStore.getState().logGroups}
                temp[ev.logGroup.serviceName] = temp[ev.logGroup.serviceName]?.filter((lg) => lg.logGroupId !== ev.logGroup?.logGroupId)
                useLogGroupStore.setState({...useLogGroupStore.getState(), logGroups: {...temp}})
              }
            break;
            default: 
          }
        })
      }
      this.socket.onclose = (event: any) => {
        console.log('websocket closed' + this.attempt);
        this.lastEvent = new Date().toISOString();
        if (this.attempt < this.reconnectAttempts) {
          this.attempt += 1;
          console.log(`Attempt ${this.attempt}, reconnect in ${3+(0.5*(this.attempt**2))}s`);
          setTimeout(() => this.initSocket(), 1000*(3+(0.5*(this.attempt**2))));
        } else
          this.attempt = 0;
      }
    } catch (e) {
      console.log(e)
    }
  }
  
  closeSocket() {
    try {
      this.attempt = this.reconnectAttempts;
      this.lastEvent = undefined;
      this.socket?.close();
    } catch (e) {
      console.log(e);
    }
  }
}
export default new BffSocket(20);

const getTok = async () => {
  let apiToken = '';
  let authTokenKey = ''
    for (let item in sessionStorage) {
      if (item.match(/accessToken/)) {
        authTokenKey = item
        break
      }
    }
    const prevAccessToken = authTokenKey === '' ? '' : sessionStorage.getItem(authTokenKey)
    try {
      const session = await Auth.currentSession()

      if (session.isValid()) {
        // getting new api token if access token expired
        const currentAccessToken = session.getAccessToken()?.getJwtToken()
        if (prevAccessToken !== currentAccessToken) {
          bffApi.exchangeToken(currentAccessToken).then((newApiToken) => {
            apiToken = newApiToken!;
            sessionStorage.setItem('dashboard.token', newApiToken!)
          })
        }
        apiToken = sessionStorage.getItem('dashboard.token') || '';
        return { idToken: session.getIdToken().getJwtToken(), apiToken: apiToken! }
      }
    } catch (err) {
      await Auth.signOut()
      sessionStorage.clear()
      if (
        !(err instanceof Error && err.name === 'NotAuthorizedException') &&
        !(err as string).match(/No current user/)
      ) {
        throw err
      }
    }
    return null
}