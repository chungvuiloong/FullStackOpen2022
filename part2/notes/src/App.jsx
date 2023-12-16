import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'

const App = ({ notes: newNotes }) => {
    const [notes, setNotes] = useState(newNotes)
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(false)

    useEffect(() => {
        console.log('effect')
        axios
          .get('http://localhost:3001/notes')
          .then(response => {
            console.log('promise fulfilled')
            setNotes(response.data)
          })
      }, [])
  

      const addNote = event => {
        event.preventDefault()
        const noteObject = {
          content: newNote,
          important: Math.random() < 0.5,
        }
      
        axios
        .post('http://localhost:3001/notes', noteObject)
        .then(response => {
          setNotes([...notes, response.data]);
          setNewNote('')
        })
      }

  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)



  
    const toggleImportanceOf = (id) => {
      console.log('importance of ' + id + ' needs to be toggled')
    }
  

  return (
    <div>
        <h1>Notes</h1>
        <div>
            <button onClick={() => setShowAll(!showAll)}>
            show {showAll ? 'important' : 'all' }
            </button>
        </div>      
        <ul>
            {notesToShow.map(note => 
                <Note 
                    key={note.id} 
                    note={note} 
                    toggleImportance={() => toggleImportanceOf(note.id)}
                />
            )}
        </ul>
      <form onSubmit={addNote}>
        <input
            value={newNote}
            onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form> 
    </div>
  )
}

export default App