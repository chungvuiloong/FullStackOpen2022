import { useState } from 'react'

const App = ({ notes }) => {

  return (
    <div>
      <h1>Notes</h1>
      <ul>
        {notes.map((note, i) => 
          <li key={i}>
            {note.content}
          </li>
        )}
      </ul>
    </div>
  )
}

export default App