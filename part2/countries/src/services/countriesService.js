import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/'

const getAll = () => {
  return axios
    .get(`${baseUrl}/api/all`)
    .then(response => response.data)
}

export default { getAll }