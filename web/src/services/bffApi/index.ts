import axios, { AxiosError } from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'
import {ILogGroup, IService} from '../../interfaces'

export class BffApiService {
  private readonly baseUrl: string | undefined
  /**
   *
   */
  constructor() {
    axiosRetry(axios, { retries: 3, retryDelay: this.retryFunction() })
    this.baseUrl = process.env.REACT_APP_API_BASE_URL
  }

  public async exchangeToken(authToken: string): Promise<string | null> {
    const url = `${this.baseUrl}/token/exchange`
    const response = await axios.request({
      method: 'POST',
      url,
      headers: { Authorization: `Bearer ${authToken}` }
    })
    const resObj = response.data as { apiToken: string }
    return resObj.apiToken
  }

  public async getDashboardData(apiToken: string): Promise<{ services: IService[] } | null> {
    const url = `${this.baseUrl}/dashboard`
    const response = await axios.request({
      method: 'GET',
      url,
      headers: { Authorization: `Bearer ${apiToken}` }
    })
    return response?.data
  }

  public async getServices(apiToken: string, since?: string): Promise<{ services: IService[] } | null> {
    const url = `${this.baseUrl}/services?since=${since || ''}`
    const response = await axios.request({
      method: 'GET',
      url,
      headers: { Authorization: `Bearer ${apiToken}` }
    })
    return response?.data
  }

  public async getLogGroups(serviceName: string, apiToken: string, since?: string): Promise<{ logGroups: ILogGroup[] } | null> {
    const url = `${this.baseUrl}/loggroups/${serviceName}?since=${since || ''}`
    const response = await axios.request({
      method: 'GET',
      url,
      headers: { Authorization: `Bearer ${apiToken}` }
    })
    return response?.data
  }

  // private async fetch(apiPath: string, opts) {
  //   try {
  //     const url = `${this.config.baseUrl}/${apiPath}`
  //     const response = await axios.request({
  //       method: 'GET',
  //       ...opts,
  //       url,
  //       headers: { ...opts?.headers, Authorization: `Bearer ${authRes.data.token}` }
  //     })

  //     return response.data as T
  //   } catch (e) {
  //     console.error('Could not execute the request', { message: e.message, stack: e.stack })
  //     throw e
  //   }
  // }

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
