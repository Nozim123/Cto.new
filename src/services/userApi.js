import axios from 'axios'

const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? '/api/public'
    : 'http://localhost:5000/api/public'

const userApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

userApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('userToken')
      if (!window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const userAuthAPI = {
  register: (payload) => userApi.post('/auth/register', payload),
  login: (payload) => userApi.post('/auth/login', payload),
  getProfile: () => userApi.get('/auth/me')
}

export default userApi
