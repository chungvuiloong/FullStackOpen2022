import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState()
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
    console.log(searchName);
  }

  const addPerson = (e) => {
    e.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
    };
    setPersons([...persons, newPerson])
  }

  const filteredName = persons.filter(person => person.name.includes(searchName))

  return (
    <div>
      <h2>Phonebook</h2>
      <p>Filter list with the name: <input onChange={searchNameHandler} /></p>

      {/* Form */}
      <h3>Add a new person & number</h3>
      <form onSubmit={addPerson}>
        <div>name:    
          <input type="text" 
            name="name"
            value={persons.name}
            onChange={nameChangeHandler} />
        </div>

        <div>number:  
          <input type="text" 
            name="number"
            value={persons.number}
            onChange={numberChangeHandler} />
        </div>

        <div><button type="submit" >add</button></div>
      </form>

      <h2>Numbers</h2>
      <div>
        {filteredName.map((person)=> 
        <div key={person.id}>{person.name} {person.number}
        </div>
        )}
      </div>
    </div>
  )
}

export default App