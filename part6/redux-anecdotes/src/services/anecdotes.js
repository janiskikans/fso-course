import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  
  return response.data
}

const createNew = async (content) => {
  const response = await axios.post(baseUrl, {content, votes: 0})

  return response.data
}

const updateAnecdote = async (anecdoteId, anecdoteObject) => {
  const response = await axios.put(`${baseUrl}/${anecdoteId}`, anecdoteObject)

  return response.data
}

export default { getAll, createNew, updateAnecdote }