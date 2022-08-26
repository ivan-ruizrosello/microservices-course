const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const PORT = 4003;
const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/', (req, res) => { 
    res.send('Ping');
});


app.post('/events', async (req, res) => { 
    const { type, data } = req.body;

    if(type === 'CommentCreated') { 
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://event-bus-srv:4005/events', {
            type: 'CommentModerated',
            data: { 
                status,
                id: data.id,
                postId: data.postId,
                content: data.content,
            }
        })
    }
    
    res.send();
})

app.listen(PORT, () => { 
    console.log(`Listening on http://localhost:${PORT}`)
});