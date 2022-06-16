import { useState } from 'react';
import Statistics from "./Components/Statistics/Statistics";
import Feedback from "./Components/Feedback/Feedback";
import Button from "./Components/Button/Button";


const App = () => {
  let [ good, setGood ] = useState(0);
  let [ neutral, setNeutral ] = useState(0);
  let [ bad, setBad ] = useState(0);
  let [ star, setStar ] = useState(0);

  let total = good + bad + neutral;
  let average = star / total;
  let positivePercent = (good / total) * 100;

  // Good
  function goodHandler () {
    setStar(star + 1);
    setGood(good + 1);
  }

  // Neutral
  function neutralHandler () {
    setNeutral(neutral + 1);
  }

  // bad
  function badHandler () {
    setStar(star - 1);
    setBad(bad + 1);
  }

  return (
    <div>
      <Feedback />
      <Button type="button" onClick={goodHandler} text="Good"/>
      <Button type="button" onClick={neutralHandler} text="Neutral"/>
      <Button type="button" onClick={badHandler} text="Bad"/>
      <Statistics
            good={good}
            neutral={neutral}  
            bad={bad}
            star={star}
            total={total}
            average={average}
            positive={positivePercent}
      />
      
      
      

    </div>
  )
}

export default App