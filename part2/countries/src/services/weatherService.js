import axios from 'axios'

const baseUrl = 'https://api.openweathermap.org'; 

const getCurrentForCoords = (lat, lon) => {
  const apiKey = import.meta.env.VITE_WEATHER_KEY

  return axios
    .get(`${baseUrl}/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
    .then(response => response.data)
}

export default { getCurrentForCoords }