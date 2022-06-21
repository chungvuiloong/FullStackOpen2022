import React from 'react';

const Part = (props) => {
    const part1 = props.parts[0].name + ' ' + props.parts[0].exercises;
    const part2 = props.parts[1].name + ' ' + props.parts[1].exercises;
    const part3 = props.parts[2].name + ' ' + props.parts[2].exercises;
    const parts = [part1, part2, part3]; 

    return (
        <div>
            {parts.map((part) => {return <p key={part}>{part}</p>
            })}
      	</div>
    );
};

export default Part;