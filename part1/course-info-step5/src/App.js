import './App.css';
import Header from './Components/Header/Header';
import Total from './Components/Total/Total';
import Part from './Components/Part/Part';

const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Content = (props) => {
    return(
      <div>
        <Part parts={props.parts}/>
      </div>
    )
  }

  return (
    <div>
      <Header course={course} />
      {/* <Part parts={course.parts}/> */}
      <Content parts={course.parts}/>
      <Total part={course} />
    </div>
  )
}

export default App