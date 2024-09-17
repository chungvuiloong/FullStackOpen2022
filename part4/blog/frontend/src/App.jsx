import { useState, useEffect } from 'react'
import axios from 'axios'
import blogService from './services/blog'
import './App.css'

function App() {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  useEffect(() => {
    blogService.getAll()
      .then(response => {
        // console.log('promise fulfilled')
        setBlogs(response.data)
      })
  }, [newBlog])

const add_blog = (event) => {
    event.preventDefault()
    axios
        .post('http://localhost:3003/api/blogs', newBlog)
        .then(response => {
            setBlogs(blogs.concat(response.data))
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
