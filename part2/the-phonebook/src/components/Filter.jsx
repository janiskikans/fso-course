const Filter = ({ searchableName, handleSearchableNameChange }) => {
  return (
    <div>filter shown with
        <input value={searchableName} onChange={handleSearchableNameChange} />
    </div>
  )
}

export default Filter