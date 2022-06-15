import { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  // good
  // neutral
  // bad
  // the total number of collected feedback
  // the average score (good: 1, neutral: 0, bad: -1) and 
  // the percentage of positive feedback.

  const total = good + bad + neutral;

  return (
    <div>
      code here
      <div>
        The total is {total}
      </div>
    </div>
  )
}

export default App