const express = require('express');
const app = express();
const Note = require('./models/note');
require('dotenv').config()

app.use(express.json()); //Without this req.body for POST will be undefined.
app.use(express.static('build'));

const cors = require('cors');

app.use(cors());
app.use(express.static('build'));  //whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address.
// Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend.
// GET requests to the address www.serversaddress.com/api/notes will be handled by the backend's code.

const generateID = () => {
    return notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 0;
};

app.get('/', (req, res) => {
    res.send('<h1>Notes-App Server</h1>');
})

app.get('/api/notes', (req, res) => {
    Note.find({}).then(notes => {
        res.send(notes)
    })
});

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    Note.find({_id: id}).then(
        note => {
            res.json(note);
        }
    )
    if (note) {
        res.json(note);
    } else {
        res.status(404).end(`Note with id ${id} doesn't exist`);
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    if (notes.some(note => note.id === id)) {
        notes = notes.filter(note => note.id !== id);
        res.status(204).end();
    } else {
        res.status(404).end();
    }
})
app.post('/api/notes', (req, res) => {
    const body = req.body;
    if (!body.content) {
        return res.status(400).json({
            error: 'content missing'
        });
    }

    const note = {
        id: generateID(),
        content: body.content,
        date: new Date(),
        important: body.important || false
    }

    notes = notes.concat(note);
    res.json(note);
})

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})