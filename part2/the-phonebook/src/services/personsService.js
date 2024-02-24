import axios from 'axios'

const baseUrl = 'http://localhost:3001/persons'

const getAll = () => {
  return axios
    .get(baseUrl)
    .then(response => response.data)
}

const createPerson = newPerson => {
  return axios
    .post(baseUrl, newPerson)
    .then(response => response.data)
}

const deletePerson = id => {
  return axios
    .delete(`${baseUrl}/${id}`)
    .then(response => response.data)
}

const updatePerson = (id, changedPerson) => {
  return axios
    .put(`${baseUrl}/${id}`, changedPerson)
    .then(response => response.data)
}

export default { getAll, createPerson, deletePerson, updatePerson }