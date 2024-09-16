import { useState, useEffect } from 'react'
import blogService from './services/blog'
import './App.css'

function App() {
  const [blogs, setBlogs] = useState([])
//   const [newBlog, setNewBlog] = useState('')

  useEffect(() => {
    blogService.getAll()
      .then(response => {
        console.log('promise fulfilled')
        setBlogs(response.data)
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
