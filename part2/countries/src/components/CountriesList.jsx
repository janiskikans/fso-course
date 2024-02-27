const CountriesList = ({ countries, handleCountryClick }) => {
  if (countries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  }

  return (
    <div>
      {countries.map(country =>
        <div key={country.cca2}>
          {country.name.common} <button onClick={() => handleCountryClick(country.name.common)}>show</button>
        </div>
      )}
    </div>
  )
}

export default CountriesList