const dummy = (blogs) => {
    return blogs.length === 0 ? 1 : blogs.length 
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0);
}

const favouriteBlog = (blogs) => {
    const mostLikedBlog = blogs.reduce((max, blog) => blog.likes > max.likes ? blog : max);
    
    return {
        title: mostLikedBlog.title,
        author: mostLikedBlog.author,
        likes: mostLikedBlog.likes
    };
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog
}