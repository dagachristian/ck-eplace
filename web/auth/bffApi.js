import axios, { AxiosError } from 'axios'
import axiosRetry, { exponentialDelay } from 'axios-retry'

export class BffApiService {
  baseUrl
  /**
   *
   */
  constructor() {
    axiosRetry(axios, { retries: 3, retryDelay: this.retryFunction() })
    this.baseUrl = 'https://h0y0rftc0l.execute-api.us-east-1.amazonaws.com/'
  }

  async exchangeToken(authToken) {
    const url = `${this.baseUrl}/token/exchange`
    const response = await axios.request({
      method: 'POST',
      url,
      headers: { Authorization: `Bearer ${authToken}` }
    })
    const resObj = response.data
    return resObj.apiToken
  }

   async getDashboardData(apiToken) {
    const url = `${this.baseUrl}/dashboard`
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

  retryFunction() {
    return (retryCount, error) => {
      console.info('Retrying request', {
        retryCount,
        responseStatus: error.response?.status,
        error: error.message
      })
      return exponentialDelay(retryCount)
    }
  }
}
