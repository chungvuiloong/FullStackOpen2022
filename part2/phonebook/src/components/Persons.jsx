import React from 'react';

const Persons = ({ filteredName }) => {
    return  filteredName.map((person)=> <div key={person.id}>{person.name} {person.number}</div>)
};

export default Persons;