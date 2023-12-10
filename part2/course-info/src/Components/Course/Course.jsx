import React from 'react';
import Header from '../Header/Header';
import Content from '../Content/Content';


const Course = ({ name, id, parts }) => {

    return (
      <>
        <Header text={name} id={id}/>
        <Content parts={parts}/>
      </>
    )
  }

export default Course;