const express = require("express");
const {randomBytes} = require('crypto')
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4001;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { 
    res.send('Ping');
});

const commentsByPostId = { };


app.get('/posts/:postId/comments', (req, res) => { 
    const { postId } = req.params;

    res.send(commentsByPostId[postId]);
});

app.post('/posts/:postId/comments', async (req, res) => { 
    const commentId = randomBytes(4).toString('hex');
    const { postId } = req.params;


    const { content } = req.body;
    
    const newComment = { id: commentId, content, status: 'pending' }
    commentsByPostId[postId] = commentsByPostId[postId] ? [...commentsByPostId[postId], newComment] : [newComment]

    await axios.post('http://event-bus-srv:4005/events', {
        type: 'CommentCreated',
        data: { 
            postId,
            ...newComment
        },
    })

    res.status(201).send(commentsByPostId[postId]);
});

app.post('/events', async (req, res) => { 
    const { type, data } = req.body;

    if( type === 'CommentModerated') { 
        const { id, status, postId } = data;
        const comments = commentsByPostId[postId];
        const comment = comments.find(c => {
            return c.id === id;
        });
        comment.status = status;

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentUpdated',
            data: { 
                ...comment,
                postId,
            }
        });
    }

    res.send();
})

app.listen(PORT, () => { 
    console.log(`Listening on http://localhost:${PORT}`);
});