import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import personsService from './services/personsService'
import Notification from './components/Notification'

const App = () => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchableName, setSearchableName] = useState('')
  const [persons, setPersons] = useState([]) 
  const [notification, setNotification] = useState({ message: '', type: 'success' })

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

  const showNotification = (message, type = 'success') => {
      setNotification({ message, type })
      setTimeout(() => setNotification({ message: '', type: 'success' }), 5000)
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
          showNotification(`Updated ${updatedPerson.name}`)
        })
        .catch(() => {
          showNotification(`Information of ${existingPerson.name} has already been removed from the server`, 'error')
          setPersons(persons.filter(person => person.id !== existingPerson.id))
        })
      
      return
    }

    const newPerson = { name: newName, number: newNumber }

    personsService
      .createPerson(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        clearNewPersonData()
        showNotification(`Added ${createdPerson.name}`)
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
      <Notification notification={notification} />
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