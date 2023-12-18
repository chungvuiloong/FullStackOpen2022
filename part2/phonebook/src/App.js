import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import personServices from './services/people'

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState("")
    const [searchName, setSearchName] = useState("")

    useEffect(() => {
        personServices
        .getAll()
        .then(person => {
            setPersons(person)
        })
    }, [])

  const nameChangeHandler = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setNewName(value)
  }

  const numberChangeHandler = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setNewNumber(value)
  }

  const searchNameHandler = (e) => {
    e.preventDefault();
    const value = e.target.value;
    setSearchName(value)
  }

  const addPerson = (e) => {
    e.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    };
    setPersons([...persons, newPerson])
    setNewName("")
    setNewNumber("")
  }

  const filteredName = persons.filter(person => person.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchNameHandler={searchNameHandler}/>
      
      <h2>Add a new person & number</h2>
      <Form addPerson={addPerson} newName={newName} nameChangeHandler={nameChangeHandler} newNumber={newNumber} numberChangeHandler={numberChangeHandler} />

      <h2>Contacts</h2>
      <Persons filteredName={filteredName} />
    </div>
  )
}

export default App