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

const mostBlogs = (blogs) => {
    const authorBlogCount = {};

    blogs.forEach(blog => {
        const author = blog.author;
        authorBlogCount[author] = (authorBlogCount[author] || 0) + 1;
    });

    const mostBlogs = Object.entries(authorBlogCount).reduce((max, author) => {
        return author[1] > max[1] ? author : max;
    }, ['', 0]);
    return {
        author: mostBlogs[0],
        blogs: mostBlogs[1]
    };
}

module.exports = {
    dummy,
    totalLikes,
    favouriteBlog,
    mostBlogs
}