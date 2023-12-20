import React from 'react';
import { deletePersonId } from '../services/people'

const Persons = ({ filteredName, persons, setPersons }) => {

    const deletePerson = (person) => {
        const personIdtoRemove = persons.filter((p)=> p.id !== person?.id)
        const text = `Do you want to delete ${person.name}`
       if (window.confirm(text) === true) {
            return deletePersonId(person?.id).then(setPersons(personIdtoRemove)).catch(error => {
                console.log('fail')
              })
       }
    }

    return  (
        <>
            {
                filteredName
                    .map((person) => 
                        <div key={person.id}>
                            <span>{person.name} {person.number}</span>
                            <button onClick={()=> deletePerson(person)}>Delete</button>
                        </div>
            )}
        </>
    )
};

export default Persons;