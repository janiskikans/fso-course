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

const createBlog = async (newBlog) => {
  const response = await axios.post(BASE_URL, newBlog, getBaseConfig())

  return response.data
}

const updateBlog = async (updatedBlog) => {
  const response = await axios.put(`${BASE_URL}/${updatedBlog.id}`, updatedBlog, getBaseConfig())

  return response.data
}

const deleteBlog = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, getBaseConfig())

  return response.data
}

const setToken = (token = null) => {
  if (!token) {
    currentToken = null
  }

  currentToken = `Bearer ${token}`
}

export default { getAll, createBlog, updateBlog, deleteBlog, setToken }