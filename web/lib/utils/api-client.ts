import axios, { AxiosError } from 'axios'

import { UninterceptedApiError } from '@/types/api'

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
})

apiClient.interceptors.response.use(
  (config) => {
    return config
  },
  (error: AxiosError<UninterceptedApiError>) => {
    // parse error
    if (error.response?.data.message) {
      return Promise.reject({
        ...error,
        response: {
          ...error.response,
          data: {
            ...error.response.data,
            message:
              typeof error.response.data.message === 'string'
                ? error.response.data.message
                : Object.values(error.response.data.message)[0][0],
          },
        },
      })
    }
    return Promise.reject(error)
  }
)

export { apiClient }
