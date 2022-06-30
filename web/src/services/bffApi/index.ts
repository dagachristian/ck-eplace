import axios, { AxiosError } from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'
import { IUser } from '../interfaces'

export class BffApiService {
  private readonly baseUrl: string | undefined
  token
  /**
   *
   */
  constructor() {
    axiosRetry(axios, { retries: 3, retryDelay: this.retryFunction() })
    this.baseUrl = process.env.API_URL
    this.token = ''
  }

  public async login(username: string, password: string): Promise<IUser> {
    const url = `${this.baseUrl}/token/login`
    const response = await axios.request({
      method: 'POST',
      url,
      data: {
        username,
        password
      }
    })
    this.token = response.data.token;
    return response.data.user;
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

  public async logout() {
    const url = `${this.baseUrl}/auth/register`
    const response = await axios.request({
      method: 'GET',
      url,
      headers: {
        Authorization: `Bearer ${this.token}`
      }
    })
    return response.status;
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
