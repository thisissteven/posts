export type ApiResponse<T> = {
  code: string
  data: T
}

export type ApiError = {
  message: string
}

export type UninterceptedApiError = {
  message: string | Record<string, string[]>
}

export interface PaginatedApiResponse<T> {
  data: T[]
  cursor?: string
}
