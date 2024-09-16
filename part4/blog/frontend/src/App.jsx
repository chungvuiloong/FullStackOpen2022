import { useState, useEffect } from 'react'
import blogService from './services/blog'
import './App.css'

function App() {
  const [blogs, setBlogs] = useState([])
//   const [newBlog, setNewBlog] = useState('')

  useEffect(() => {
    blogService.getAll()
      .then(initialNotes => {
        setBlogs(initialNotes)
      })
  }, [blogs])

  return (
    <>
        <h1>Blog</h1>
        <form >
            <input
            // value={newBlog}
            />
            <button type="submit">save</button>
        </form>
    </>
  )
}

export default App
