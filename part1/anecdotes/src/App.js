import { useState, useEffect } from 'react';



const Button = (props) => {
  return (
    <>
      <button onClick={props.onClick}>{props.text}</button>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ];
  
  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState([0,0,0,0,0,0,0])

  const nextAnect = () => {
    if (selected < 6) {
      setSelected(selected + 1)
    } else {
        reset()
    }

  }

  const voteHandler = () => {
    //make a copy of the votes
    const votesCopy = [...votes]
    
    //increase the votes for the selected anecdote
    votesCopy[selected] += 1;
    
    //and finally update the state
    setVotes(votesCopy);

    console.log(votesCopy);
  }

  const reset = () => {
    setSelected(0)
  }
  
  return (
    <div>
        <h1>Anecdotes of the day</h1>
        {anecdotes[selected]}
        <p>has {votes[selected]} votes</p>
        <div>
            <Button onClick={voteHandler} text="Vote"/>
            <Button onClick={nextAnect} text="Next anecdote"/>
        </div>
      { 
        Math.max(...votes) === 0 ? <h1></h1>
        : <>
            <h1>Anecdotes with most votes</h1>
            <div>{anecdotes[votes.indexOf(Math.max(...votes))]}</div>
            <div>has {Math.max(...votes)} votes</div>
          </>

      }
      
    </div>
  )
}

export default App;