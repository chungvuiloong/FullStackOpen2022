import { useState } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState("")
  const [searchName, setSearchName] = useState("")

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