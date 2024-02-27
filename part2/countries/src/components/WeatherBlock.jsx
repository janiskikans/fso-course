import { useEffect } from "react"
import weatherService from "../services/weatherService"
import { useState } from "react"

const WeatherBlock = ({ country }) => {
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    if (country) {
      weatherService
      .getCurrentForCoords(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
      .then(initialWeather => setWeather(initialWeather))
    }
  }, [country])

  if (!country || !country.capital | !weather) {
    return null
  }

  return (
    <div>
      <h2>Weather in {country.capital[0]}</h2>
      <div>temperature {weather.main.temp} Celsius</div>
      <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} />
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

export default WeatherBlock