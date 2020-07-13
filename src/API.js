import axios from 'axios'


const API = axios.create({
  baseURL: 'http://localhost:3000'
})

const placeTokenInRequestHeaders = req => {
  const token = localStorage.getItem('authToken')
  if (token) {
    req.headers['Authorization'] = `Bearer ${token}`
  }
  return req
}

API.interceptors.request.use(placeTokenInRequestHeaders);

export default API