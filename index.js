const express = require('express');
const cors = require('cors');
const conndb = require('./conndb');
const Blog = require('./blogs');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello world!');
});

conndb();

app.get('/getblogs', async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/getblogs/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (blog) {
      res.json(blog);
    } else {
      res.status(404).json({ error: 'Blog not found' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/addblog', async (req, res) => {
  try {
    const { name, title, description, imgurl } = req.body;
    const newBlog = new Blog({
      name,
      title,
      description,
      imgurl,
      slug: Date.now().toString(),
    });

    const savedBlog = await newBlog.save();
    res.status(201).json(savedBlog);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add this route to increment likes
app.post('/blogs/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    blog.likes = (blog.likes || 0) + 1; // Increment the likes count
    await blog.save();

    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}`));
