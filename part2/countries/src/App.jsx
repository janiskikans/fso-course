import { useState } from "react"
import CountrySearch from "./components/CountrySearch"
import { useEffect } from "react"
import countriesService from "./services/countriesService"
import CountriesList from "./components/CountriesList"
import SingleCountryInfo from "./components/SingleCountryInfo"

const App = () => {
  const [allCountries, setAllCountries] = useState(null)
  const [searchableCountry, setSearchableCountry] = useState('')
  const [filteredCountries, setFilteredCountries] = useState([])

  useEffect(() => {
    countriesService
      .getAll()
      .then(initialCountries => setAllCountries(initialCountries))
  }, [])

  useEffect(() => {
    if (!searchableCountry || !allCountries) {
      setFilteredCountries([])

      return
    }

    const newFilteredCountries = allCountries
      .filter(country => country.name.common.toLowerCase().includes(searchableCountry.toLowerCase()))

    setFilteredCountries(newFilteredCountries)
  }, [searchableCountry, allCountries])

  if (!allCountries) {
    return null
  }

  const handleSearchableCountryChange = event => setSearchableCountry(event.target.value)
  const handleCountryClick = country => setSearchableCountry(country)

  return (
    <div>
      <CountrySearch
        searchableCountry={searchableCountry}
        handleSearchableCountryChange={handleSearchableCountryChange}
      />
      {filteredCountries.length === 1
        ? <SingleCountryInfo country={filteredCountries[0]} />
        : <CountriesList countries={filteredCountries} handleCountryClick={handleCountryClick} />
      }
    </div>
  )
}

export default App
