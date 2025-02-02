import { useState, useEffect } from "react"
import countriesService from "../services/countriesService"

export const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

export const useCountry = (name) => {
  const [country, setCountry] = useState(null)
  
  useEffect(() => {
    countriesService
      .getByName(name)
      .then(countryData => setCountry(countryData ? {
        found: true,
        data: {
          name: countryData.name.common,
          capital: countryData.capital[0] ?? null,
          population: countryData.population,
          flag: countryData.flags.png,
        }
      } : { found: false }
    ))
  }, [name])
  
  return country
}