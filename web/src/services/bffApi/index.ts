import axios, { AxiosError } from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'
import { IUser } from '../interfaces'

export class BffApiService {
  private readonly baseUrl: string | undefined
  /**
   *
   */
  constructor() {
    axiosRetry(axios, { retries: 0, retryDelay: this.retryFunction() })
    this.baseUrl = process.env.REACT_APP_API_BASE_URL + '/api'
  }

  public async login(username: string, password: string): Promise<{apiToken: string, refreshToken: string, user: IUser}> {
    const url = `${this.baseUrl}/auth/login`
    const response = await axios.request({
      method: 'POST',
      url,
      data: {
        username,
        password
      }
    })
    return response.data;
  }

  public async currentSession(token: string): Promise<string> {
    const url = `${this.baseUrl}/auth/currentSession`
    const response = await axios.request({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data.token;
  }

  public async renewSession(token: string): Promise<{apiToken: string, user: IUser}> {
    const url = `${this.baseUrl}/auth/renewSession`
    const response = await axios.request({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data;
  }

  public async register(userInfo: IUser): Promise<{ user: IUser }> {
    const url = `${this.baseUrl}/auth/register`
    const response = await axios.request({
      method: 'POST',
      url,
      data: userInfo
    })
    return response.data;
  }

  public async logout(token: string) {
    const url = `${this.baseUrl}/auth/logout`
    const response = await axios.request({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.status;
  }

  public async getCanvas(type?: string) {
    const url = `${this.baseUrl}/canvas`
    const response = await axios.request({
      method: 'GET',
      url,
      responseType: 'arraybuffer',
      params: {
        type: type || 'raw'
      }
    })
    return response.data;
  }

  private retryFunction() {
    return (retryCount: number, error: AxiosError) => {
      console.info('Retrying request', {
        retryCount,
        responseStatus: error.response?.status,
        error: error.message
      })
      return exponentialDelay(retryCount)
    }
  }
}

export const bffApi = new BffApiService();
