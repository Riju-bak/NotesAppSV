const notesRouter = require('express').Router();
const Note = require('../models/note');
const logger = require("../utils/logger");

// notesRouter.get('/', (req, res) => {
//     res.send('<h1>Notes-App Server</h1>');
// })

notesRouter.get('/', (req, res) => {
    Note.find({}).then(notes => {
        res.send(notes)
    });
});

notesRouter.get('/:id', (req, res, next) => {
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

notesRouter.delete('/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findByIdAndDelete(id)
        .then(result => {
            res.status(204).end();
        })
        .catch(err => {
            next(err)
        });
})

notesRouter.post('/', (req, res, next) => {
    const body = req.body;

    const note = new Note({
            content: body.content,
            date: new Date(),
            important: body.important || false
        }
    );
    note.save()
        .then(savedNote => {
            logger.info(`note saved`);
            res.json(savedNote);
        })
        .catch(err => {
            next(err);
        });
});

notesRouter.put('/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findByIdAndUpdate(id, req.body, { new:true, runValidators: true, context: 'query' })
        .then(note => {
            if(note){
                 //note itself is latest since we have set new:true in the configuration object passed to findByIDAndUpdate(), unlike the Phonebook server.
                res.json(note);
            }
            else{
                res.status(404).end();
            }
        })
        .catch(err => next(err));
})

module.exports = notesRouter;