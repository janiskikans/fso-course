import axios from 'axios'

const baseUrl = 'https://studies.cs.helsinki.fi/restcountries'

const getByName = (name) => {
  return axios
    .get(`${baseUrl}/api/name/${name}`)
    .then(response => response.data)
    .catch(() => null)
}

export default { getByName }