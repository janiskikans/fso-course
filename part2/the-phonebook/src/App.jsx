import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/personsService'

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchableName, setSearchableName] = useState('')
  const [persons, setPersons] = useState([]) 

  useEffect(() => {
    personsService
      .getAll()
      .then(fetchedPersons => setPersons(fetchedPersons))
  }, [])

  const handleNewNameChange = (event) => setNewName(event.target.value)
  const handleNewNumberChange = (event) => setNewNumber(event.target.value)
  const handleSearchableNameChange = (event) => setSearchableName(event.target.value)

  const clearNewPersonData = () => {
    setNewName('')
    setNewNumber('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)

    if (existingPerson) {
      if (!confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)) {
        return
      }

      personsService
        .updatePerson(existingPerson.id, { ...existingPerson, number: newNumber })
        .then(updatedPerson => {
          const newPersons = persons.map(person => existingPerson.id !== person.id ? person : updatedPerson)
          setPersons(newPersons)
          clearNewPersonData()
        })

      return
    }

    const newPerson = { name: newName, number: newNumber }

    personsService
      .createPerson(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        clearNewPersonData()
      })
  }

  const handleDelete = id => {
    const personToDelete = persons.find(person => person.id === id)
    if (!personToDelete) {
      return
    }

    if (!confirm(`Delete ${personToDelete.name}?`)) {
      return
    }

    personsService
      .deletePerson(id)
      .then(deletedPerson => {
        setPersons(persons.filter(person => person.id !== deletedPerson.id))
      })
  }

  const contactsToShow = persons.filter((person) => person.name.toLowerCase().includes(searchableName.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchableName={searchableName} handleSearchableNameChange={handleSearchableNameChange} />
      <h2>add a new</h2>
      <PersonForm
        handleSubmit={handleSubmit}
        newName={newName}
        newNumber={newNumber}
        handleNewNameChange={handleNewNameChange}
        handleNewNumberChange={handleNewNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={contactsToShow} handleDelete={handleDelete} />
    </div>
  )
}

export default App