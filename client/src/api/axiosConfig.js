import axios from 'axios'

const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const cleanUrl = rawApiUrl.trim().replace(/\/+$/, '')
const baseURL = cleanUrl.endsWith('/api') ? cleanUrl : `${cleanUrl}/api`

const API = axios.create({
  baseURL,
})

export default API

