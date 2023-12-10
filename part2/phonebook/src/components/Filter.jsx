import React from 'react';

const Filter = ({searchNameHandler}) => {
    return <p>Filter list with the name: <input onChange={searchNameHandler} /></p>
};

export default Filter;