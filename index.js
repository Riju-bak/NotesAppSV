const express = require('express');
const app = express();

app.use(express.json()); //Without this req.body for POST will be undefined.

const cors = require('cors')

app.use(cors())
app.use(express.static('build'))

let notes = [
    {
        id: 1,
        content: "HTML is easy",
        date: "2022-05-30T17:30:31.098Z",
        important: true
    },
    {
        id: 2,
        content: "Browser can execute only Javascript",
        date: "2022-05-30T18:39:34.091Z",
        important: false
    },
    {
        id: 3,
        content: "GET and POST are the most important methods of HTTP protocol",
        date: "2022-05-30T19:20:14.298Z",
        important: true
    },
    {
        id: 4,
        content: "React useEffect runs the side-effect code using handler after every render.",
        date: "2022-05-30T19:20:14.298Z",
        important: false
    }
]

const generateID = () => {
    return notes.length > 0 ? Math.max(...notes.map(note => note.id)) + 1 : 0;
};

app.get('/', (req, res) => {
    res.send('<h1>Notes-App Server</h1>');
})

app.get('/api/notes', (req, res) => {
    res.send(notes);
})

app.get('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    const note = notes.find(note => note.id === id);
    if(note){
        res.json(note);
    }
    else{
        res.status(404).end(`Note with id ${id} doesn't exist`);
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = Number(req.params.id);
    if(notes.some(note => note.id === id)){
        notes = notes.filter(note => note.id!==id);
        res.status(204).end();
    }
    else{
        res.status(404).end();
    }
})
app.post('/api/notes', (req, res) => {
    const body = req.body;
    if(!body.content){
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

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})