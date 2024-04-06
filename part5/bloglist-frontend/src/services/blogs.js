import axios from 'axios'

const BASE_URL = '/api/blogs'

let currentToken = null

const getBaseConfig = () => {
  return {
    headers: { Authorization: currentToken }
  }
}

const getAll = () => {
  return axios.get(BASE_URL).then(response => response.data)
}

const createBlog = async (title, author, url) => {
  const response = await axios.post(BASE_URL, {title, author, url}, getBaseConfig())

  return response.data
}

const setToken = (token = null) => {
  if (!token) {
    currentToken = null
  }

  currentToken = `Bearer ${token}`
}

export default { getAll, createBlog, setToken }