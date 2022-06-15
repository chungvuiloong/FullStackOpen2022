import React from 'react';

const Total = (props) => {

    const parts = props.parts[0].exercises + props.parts[1].exercises + props.parts[2].exercises;

    return (
        <div>
         Number of exercises {parts}
        </div>
    );
};

export default Total;