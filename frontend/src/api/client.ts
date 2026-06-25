import axios from 'axios'

const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/v1'

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('mv_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('mv_token')
      const redirect = encodeURIComponent(window.location.origin)
      const idServer = import.meta.env.VITE_IDENTITY_SERVER_URL || 'http://192.168.68.111:3007'
      window.location.href = `${idServer}/login?redirect=${redirect}`
    }
    return Promise.reject(error)
  }
)
