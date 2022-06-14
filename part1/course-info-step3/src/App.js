import './App.css';
import Header from './Components/Header/Header';
import Total from './Components/Total/Total';
// import Content from './Components/Content/Content';
import Part from './Components/Part/Part';

const App = () => {
  const course = 'Half Stack application development'
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  const total = part1.exercises + part2.exercises + part3.exercises;

  const Content = () => {
    return(
      <div>
        <Part part={part1.name} exercises={part1.exercises}/>
        <Part part={part2.name} exercises={part2.exercises}/>
        <Part part={part3.name} exercises={part3.exercises}/>
      </div>
    )
  }

  return (
    <div>
      <Header course={course}/>
      <Content />
      <Total total={total} />
    </div>
  )
}

export default App