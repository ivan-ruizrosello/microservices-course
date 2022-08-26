const express = require('express');
const { randomBytes } = require('crypto');
const cors = require('cors');
const axios = require('axios');

const PORT = 4000;
const app = express();
app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

const posts = {};

app.get('/', (req, res) => { 
    res.send('Ping');
});

app.get('/posts', (req, res) => { 
    res.send(posts);
});

app.post('/posts', async (req, res) => { 
    const id = randomBytes(4).toString('hex');

    const { title } = req.body;
    
    posts[id] = { 
        id, title,
    };

    await axios.post('http://event-bus-srv:4005/events', { 
        type: 'PostCreated',
        data: posts[id],
    });

    res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => { 
    res.send();
})

app.listen(PORT, () => { 
    console.log(`Listening on http://localhost:${PORT}`)
});