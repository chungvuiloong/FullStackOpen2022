import React from 'react';

const Filter = ({searchNameHandler}) => {
    return (
        <p>
            <div>Filter list with the name: <input onChange={searchNameHandler} /><button>Clear</button></div>
        </p>
        )
};

export default Filter;