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
    });
});

app.get('/api/notes/:id', (req, res, next) => {
    const id = req.params.id
    Note.findById(id)
        .then(note => {
            if(note){
              res.json(note);
            }
            else{
                res.status(404).end();
            }
        })
        .catch(err => {
            next(err);
        });
});

app.delete('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end();
        })
        .catch(err => {
            next(err)
        });
})

app.post('/api/notes', (req, res, next) => {
    const body = req.body;

    const note = new Note({
            content: body.content,
            date: new Date(),
            important: body.important || false
        }
    );
    note.save()
        .then(savedNote => {
            console.log(`note saved`);
            res.json(savedNote);
        })
        .catch(err => {
            next(err);
        });
});

app.put('/api/notes/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findByIdAndUpdate(id, req.body, { new:true, runValidators: true, context: 'query' })
        .then(note => {
            if(note){
                const updatedNote = note; //note itself is latest since we have set new:true in the configuration object passed to findByIDAndUpdate(), unlike the Phonebook server.
                res.json(updatedNote);
            }
            else{
                res.status(404).end();
            }
        })
        .catch(err => next(err));
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({ error: 'Unknown endpoint'});
};
app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
    console.log(err.message);
    if(err.name === "CastError"){
        return res.status(400).send({error: 'malformatted id'});
    }
    else if(err.name === "ValidationError"){
        return res.status(400).send({error: err.message});
    }
    next(err);
};
app.use(errorHandler);  //this has to be the last loaded middleware.

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})