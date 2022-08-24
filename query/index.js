const express = require("express");
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4002;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { 
    res.send('Ping');
});

const posts = { };

const handleEvent = (type, data) => {
    
  if (type === 'PostCreated') {
    const { id, title } = data;

    posts[id] = { id, title, comments: [] };
  }

  if (type === 'CommentCreated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    post.comments.push({ id, content, status });
  }

  if (type === 'CommentUpdated') {
    const { id, content, postId, status } = data;

    const post = posts[postId];
    const comment = post.comments.find(comment => {
      return comment.id === id;
    });

    comment.status = status;
    comment.content = content;
  }
}

app.get('/posts', (req, res) => { 
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;

    handleEvent(type, data);

    res.send();
});

app.listen(PORT, async () => { 
    console.log(`Listening on http://localhost:${PORT}`);


    const res = await axios.get('http://localhost:4005/events');

    for (let event of res.data) { 
      console.log('Processing event:', event.type);

      handleEvent(event.type, event.data);
    }
});