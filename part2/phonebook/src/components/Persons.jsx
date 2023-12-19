import React from 'react';
import personServices from '../services/people'

const Persons = ({ filteredName }) => {

    const deletePerson = (id) => {
        // e.preventDefault()
        personServices
            .deletePersonId(id)
            // .then(p => {
            //     setPersons(persons.concat(p))
            //     setNewName("")
            //     setNewNumber("")
            //     }
            // )
    }

    return  (
        <>
            {filteredName
                .map((person) => 
                <div key={person.id}>
                    <span>{person.name} {person.number}</span>
                    <button onClick={()=> deletePerson(person.id)}>Delete</button>
                </div>
            )}
        </>
    )
};

export default Persons;