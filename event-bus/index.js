const express = require("express");
const {randomBytes} = require('crypto')
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 4005;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => { 
    res.send('Ping');
});

const events = [];

app.get('/events', (req, res) => { 
    res.send(events);
});

app.post('/events', (req, res) => { 
    const event = req.body;

    events.push(event);

    axios.post('http://posts-srv:4000/events', event);
    axios.post('http://comments-srv:4001/events', event);
    axios.post('http://query-srv:4002/events', event);
    axios.post('http://moderation-srv:4003/events', event);

    res.send({ status: 'OK' });
});

app.listen(PORT, () => { 
    console.log(`Listening on http://localhost:${PORT}`)
});