import WeatherBlock from "./WeatherBlock";

const SingleCountryInfo = ({ country }) => {
  if (!country) {
    return null
  }

  return (
    <div>
      <h2>{country.name.common}</h2>
      <div>capital {country.capital[0] ?? 'None'}</div>
      <div>area {country.area}</div>

      <h3>languages</h3>
      <ul>
        {Object.entries(country.languages).map(language => 
          <li key={language[0]}>{language[1]}</li>
        )}
      </ul>

      <img src={country.flags.png} alt={country.flags.alt} width='200' />

      <WeatherBlock country={country} />
    </div>
  )
}

export default SingleCountryInfo