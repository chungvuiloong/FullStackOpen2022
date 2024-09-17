import { useState, useEffect } from 'react'
import axios from 'axios'
import blogService from './services/blog'
import './App.css'

function App() {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')

  useEffect(() => {
    blogService.getAll()
      .then(response => {
        // console.log('promise fulfilled')
        setBlogs(response.data)
      })
  }, [blogs])

  const add_blog = (event) => {
    event.preventDefault()
    const noteObject = {
        name: "Author Test",
        title: "title",
        author: "author",
        url: "url",
        likes: 9999
        }

    axios
        .post('http://localhost:3003/api/blogs', noteObject)
        .then(response => {
        setBlogs(blogs.concat(response.data))
        setNewBlog('')
        })
  }

  return (
    <>
        <h1>Blog</h1>
        <form onSubmit={add_blog}>
            <input
            // value={newBlog}
            />
            <button type="submit">save</button>
        </form>
    </>
  )
}

export default App
