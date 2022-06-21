import React from 'react';


const Course = ({ course }) => {
    return (
      <>
        <h1>{course.name}</h1>
        {/* <div>{course.id}</div> */}
        {course.parts.map(course => 
            <div key={course.id}>
            {course.name} {course.exercises}
            </div>)}
      </>
    )
  }

export default Course;