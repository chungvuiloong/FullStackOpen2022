import { useState, useEffect } from 'react'
import blogService from './services/blog'
import './App.css'

function App() {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '', likes: 0 });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    blogService
        .getAll()
        .then(response => {
            setBlogs(response.data)
        })
  }, [newBlog])

const add_blog = (event) => {
    event.preventDefault()

    if (editId) {
        const blog = blogs.find(blog => blog.id === editId)
        const updatedBlog = { ...blog, ...newBlog }
        return blogService
            .update(editId, updatedBlog)
            .then(response => {
                setBlogs(blogs.map(blog => (blog.id !== editId ? blog : response.data)))
                setNewBlog({ title: '', author: '', url: '', likes: 0 });
        })
      }

    return blogService
        .create(newBlog)
        .then(response => {
            setBlogs([...blogs, response.data])
            setNewBlog({ title: '', author: '', url: '', likes: 0 });
        })
  }

  const delete_blog = (id) => {
    blogService
        .deleteBlog(id)
        .then(() => {
            setBlogs(blogs.filter(blog => blog.id !== id))
        })
    }

const edit_blog = (id) => {
    setEditId(id);
    const blog = blogs.find(blog => blog.id === id);
    if (blog) {
        setNewBlog(blog);
    }
}

const add_like = (id) => {
    const blog = blogs.find(blog => blog.id === id)
    const updatedBlog = { ...blog, likes: blog.likes + 1 }
    blogService
        .update(id, updatedBlog)
        .then(response => {
            setBlogs(blogs.map(blog => (blog.id !== id ? blog : response.data)))
        })
  }

const handle_input_change = (event) => {  
    event.preventDefault()
    setNewBlog({...newBlog, [event.target.name]: event.target.value})
}

  return (
    <>
        <h1>Blog</h1>
        <form onSubmit={add_blog}>
            <input
                name='title'
                placeholder='title'
                value={newBlog.title}
                onChange={handle_input_change}
            />
            <input
                name='author'
                placeholder='author'
                value={newBlog.author}
                onChange={handle_input_change}
            />
            <input
                name='url'
                placeholder='url'
                value={newBlog.url}
                onChange={handle_input_change}
            />
            <button type="submit">save</button>
        </form>
        <div>  
            {blogs.map(blog => (
                <div key={blog.id} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    <div>
                        {blog.title} | {blog.author} | {blog.url} | {blog.likes}
                    </div>
                    <div>
                        <button onClick={() => add_like(blog.id)}>Like</button>
                        <button onClick={() => edit_blog(blog.id)}>Edit</button>
                        <button onClick={() => delete_blog(blog.id)} >Delete</button>
                    </div>
                </div>
            ))}
        </div>
    </>
  )
}

export default App
