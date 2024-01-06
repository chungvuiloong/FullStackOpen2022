import React from 'react';

const Filter = ({searchNameHandler}) => {
    return (
        <>
            <div>Filter list with the name: <input onChange={searchNameHandler} /><button>Clear</button></div>
        </>
        )
};

export default Filter;