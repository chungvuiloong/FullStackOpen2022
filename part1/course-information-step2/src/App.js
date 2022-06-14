import './App.css';
import Header from './Components/Header/Header';
import Total from './Components/Total/Total';
import Content from './Components/Content/Content';


const App = () => {
  const course = 'Half Stack application development';

  const part1 = 'Fundamentals of React';
  const exercises1 = 10;

  const part2 = 'Using props to pass data';
  const exercises2 = 7;

  const part3 = 'State of a component';
  const exercises3 = 14;

  const total = exercises1 + exercises2 + exercises3;

  return (
    <div>
      <Header course={course}/>
      <Content part={part1} exercise={exercises1}/>
      <Total total={total} />
    </div>
  )
}

export default App