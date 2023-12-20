import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import { getAll, updatePerson, createNewPerson, deletePersonId } from './services/people'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState("")
    const [searchName, setSearchName] = useState("")
    const [notification, setNotification] = useState(null)
    const filteredName = persons.filter(person => person.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))

    useEffect(() => {
        getAll()
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
        const newPersonData = {
        name: newName,
        number: newNumber,
        id: persons.length + 1
        };

    const resetNameNumberInput = () => {
        setNewName("")
        setNewNumber("")
    }

    if (checkForSamePerson()) {
        if ( window.confirm(`${newName?.name} is already in the phonebook. Updated the existing phone number?`) === true) {
            const findPersonId = (persons.find(p => p.name === newPersonData?.name) || {}).id;
            updatePerson(findPersonId, {name: newName, number: newNumber})
                .then(updatedPerson => {
                        const updatedPersons = persons.map(person =>
                            person.id === updatedPerson.id ? updatedPerson : person
                        );
                    setPersons(updatedPersons);
                    resetNameNumberInput()
                    }
                )
        }
    } else {    
            createNewPerson(newPersonData)
                .then(p => {
                    setNotification(`Added ${newPersonData.name}`, console.log(`Added ${newPersonData.name}`))
                    setPersons(persons.concat(p))
                    setTimeout(() => {
                        setNotification(null)
                      }, 5000)
                    resetNameNumberInput()
                    }
                )
        }
    }

    const checkForSamePerson = (name = newName) => {
        const check = persons.filter(p => (p.name.toLocaleLowerCase() === name.toLocaleLowerCase()))
        if (check.length === 1) {
            return true
        } 
    }

    const successful = {         
        fontSize: '25px', 
        position: 'absolute', 
        top: 0, 
        right: 0, 
        border: '2px solid green', 
        backgroundColor: 'lightgreen'  
    }

    return (
        <div style={{ position: 'relative'}}>
            <h2 >Phonebook</h2>
            <Filter searchNameHandler={searchNameHandler}/>
            
            <h2>Add a new person & number</h2>
            {
                notification ? 
                    <Notification message={notification} style={successful}/> 
                : 
                    ""
            }
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