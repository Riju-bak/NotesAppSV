const notesRouter = require('express').Router();
const Note = require('../models/note');
const logger = require("../utils/logger");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

// notesRouter.get('/', (req, res) => {
//     res.send('<h1>Notes-App Server</h1>');
// })

notesRouter.get('/', async (req, res) => {
    const notes = await Note.find({}).populate('user', {username: 1, name: 1});
    res.send(notes);
});


notesRouter.get('/:id', async (req, res, next) => {
    const id = req.params.id
    try {
        const note = await Note.findById(id);
        if (note) {
            res.json(note);
        } else {
            res.status(404).end();
        }
    } catch (exception) {
        next(exception);
    }
});

notesRouter.delete('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await Note.findByIdAndDelete(id);
        res.status(204).end();
    } catch (exception) {
        next(exception);
    }
});

const getTokenFrom = req => {
    const authorization = req.get('authorization');
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7);
    }
    return null;
};

notesRouter.post('/', async (req, res, next) => {
    const body = req.body;

    const token = getTokenFrom(req);

    // The validity of the token is checked with jwt.verify.
    // The method also decodes the token, or returns the Object which the token was based on.
    // If there is no token passed, it will return error "jwt must be provided".
    const decodedToken = jwt.verify(token, process.env.SECRET);

    if(!decodedToken.id){
        res.status(401).json({error: `Unauthorised: Missing or invalid token`});
    }

    const user = await User.findById(decodedToken.id);

    const note = new Note({
            content: body.content,
            date: new Date(),
            important: body.important || false,
            user: user._id
        }
    );
    try {
        const savedNote = await note.save();

        user.notes = user.notes.concat(savedNote._id);
        await user.save();

        logger.info(`note saved`);
        res.status(201).json(savedNote);
    } catch (exception) {
        next(exception);
    }

});

/*TODO: try-catch block must not be required as npm package express-async-errors is supposed to handle it.
However, that isn't working, figure out why*/
// notesRouter.post('/', async (req, res, next) => {
//     const body = req.body;
//
//     const note = new Note({
//             content: body.content,
//             date: new Date(),
//             important: body.important || false
//         }
//     );
//     const savedNote = await note.save();
//     logger.info(`note saved`);
//     res.status(201).json(savedNote);
// });

notesRouter.put('/:id', (req, res, next) => {
    const id = req.params.id;
    Note.findByIdAndUpdate(id, req.body, {new: true, runValidators: true, context: 'query'})
        .then(note => {
            if (note) {
                //note itself is latest since we have set new:true in the configuration object passed to findByIDAndUpdate(), unlike the Phonebook server.
                res.json(note);
            } else {
                res.status(404).end();
            }
        })
        .catch((err) => {
            next(err);
        });
});

module.exports = notesRouter;