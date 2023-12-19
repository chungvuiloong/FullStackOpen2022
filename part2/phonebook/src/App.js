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
    const filteredName = persons.filter(person => person.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))

    useEffect(() => {
        personServices
        .getAll()
        .then(person => {
            setPersons(person)
        })
    }, [ ])

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
    const newPersonData = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    };
    personServices
        .createNewPerson(newPersonData)
        .then(p => {
            setPersons(persons.concat(p))
            setNewName("")
            setNewNumber("")
            }
        )
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchNameHandler={searchNameHandler}/>
      
      <h2>Add a new person & number</h2>
      <Form addPerson={addPerson} newName={newName} nameChangeHandler={nameChangeHandler} newNumber={newNumber} numberChangeHandler={numberChangeHandler} />

      <h2>Contacts</h2>
      <Persons 
            filteredName={filteredName} 
            persons={persons} 
            setPersons={setPersons}
        />
    </div>
  )
}

export default App