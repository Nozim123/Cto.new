import axios from 'axios'

const API_BASE_URL = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api'

const publicApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const publicAPI = {
  bootstrap: () => publicApi.get('/public/bootstrap')
}

export default publicApi
