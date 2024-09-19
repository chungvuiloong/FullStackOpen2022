const dummy = (blogs) => {
    return blogs.length === 0 ? 1 : blogs.length 
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}
  
module.exports = {
    dummy,
    totalLikes
}