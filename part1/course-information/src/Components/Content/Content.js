import React from 'react';

const Content = (props) => {
    return (
        <p>
            {props.part} {props.exercise}
        </p>
    );
};

export default Content;