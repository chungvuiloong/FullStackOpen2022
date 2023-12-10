import React from 'react';
import Part from "../Part/Part";
import Total from "../Total/Total";

const Content = ({ parts }) => {
    const total = parts.reduce((sum, part) => {
        return sum + part.exercises
    }, 0)

    return (
        <>
            {parts.map( (part) => 
                <div key={part.id}>
                    <Part key={part.key} name={part.name} exercises={part.exercises} />
                </div>
            )}
            <Total total={total}/>
        </>
    );
};

export default Content;