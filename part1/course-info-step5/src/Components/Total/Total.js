import React from 'react';

const Total = (props) => {
    // console.log(props.part);
    // console.log(props.part.parts[0].exercises);

    const result = props.part.parts[0].exercises + props.part.parts[1].exercises + props.part.parts[2].exercises;

    return (
        <div>
         Number of exercises {result}
        </div>
    );
};

export default Total;