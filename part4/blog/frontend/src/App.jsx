import { useState, useEffect } from 'react'
import blogService from './services/blog'
import './App.css'

function App() {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  useEffect(() => {
    blogService
        .getAll()
        .then(response => {
            setBlogs(response.data)
        })
  }, [newBlog])

const add_blog = (event) => {
    event.preventDefault()

    blogService
        .create(newBlog)
        .then(response => {
            setBlogs([...blogs, response.data])
            setNewBlog({ title: '', author: '', url: '' });
        })
  }

const handle_input_change = (event) => {  
    event.preventDefault()
    setNewBlog({...newBlog, [event.target.name]: event.target.value})
    console.log(newBlog);
}

console.log(blogs);

  return (
    <>
        <h1>Blog</h1>
        <form onSubmit={add_blog}>
            <input
                name='title'
                placeholder='title'
                onChange={handle_input_change}
            />
            <input
                name='author'
                placeholder='author'
                onChange={handle_input_change}
            />
            <input
                name='url'
                placeholder='url'
                onChange={handle_input_change}
            />
            <button type="submit">save</button>
        </form>
    </>
  )
}

export default App
