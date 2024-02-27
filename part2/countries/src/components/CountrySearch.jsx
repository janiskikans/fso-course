const CountrySearch = ({ searchableCountry, handleSearchableCountryChange }) => {
  return (
    <>
      find countries
      <input value={searchableCountry} onChange={handleSearchableCountryChange} />
    </>
  )
}

export default CountrySearch