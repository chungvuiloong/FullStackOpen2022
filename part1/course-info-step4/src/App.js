import './App.css';
import Header from './Components/Header/Header';
import Total from './Components/Total/Total';
import Part from './Components/Part/Part';

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
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

  const Content = (props) => {
    return(
      <div>
        <Part key={parts.name} parts={parts}/>
      </div>
    )
  }

  return (
    <div>
      <Header course={course} />

      {/* <Part parts={parts}/> */}

      <Content parts={parts}/>
      <Total parts={parts} />
    </div>
  )
}

export default App