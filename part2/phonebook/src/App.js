import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Persons from './components/Persons'
import { getAll, updatePerson, createNewPerson } from './services/people'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([]) 
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState("")
    const [searchName, setSearchName] = useState("")
    const [notification, setNotification] = useState(null)
    const [errorMessage, setErrorMessage] = useState(null)
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

    function notificationHandler(message, time) {
        setNotification(message);
        setTimeout(() => {
            setNotification(null);
        }, `${time}000`);
        resetNameNumberInput();
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
                    notificationHandler(`Added ${newPersonData.name}`, 5)
                    setPersons(persons.concat(p))
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

    return (
        <div style={{ position: 'relative'}}>
            <h2 >Phonebook</h2>
            <Filter searchNameHandler={searchNameHandler}/>
            
            <h2>Add a new person & number</h2>
            {
                notification ? 
                    <Notification message={notification} notificationType={'successful'}/> 
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