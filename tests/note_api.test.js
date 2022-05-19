const app = require('../app');
const mongoose = require("mongoose");
const supertest = require("supertest");
const Note = require('../models/note');

const api = supertest(app);

//NOTE: supertest takes care that the application being tested is started at the port that
// it uses internally

//Therefore no need to run the server prior to testing API calls

const initialNotes = [
    {
        content: 'HTML is easy',
        date: new Date(),
        important: false,
    },
    {
        content: 'Browser can execute only Javascript',
        date: new Date(),
        important: true,
    },
];

beforeEach(async () => {
    await Note.deleteMany({}); //deletes all notes in testDB
    let noteObj = new Note(initialNotes[0]);
    await noteObj.save();
    noteObj = new Note(initialNotes[1]);
    await noteObj.save();
});

test('notes are returned as json', async () => {
    await api.get('/api/notes')
        .expect(200)
        .expect('Content-Type', /application\/json/)
});

test('there are two notes', async () => {
    const response = await api.get('/api/notes');
    expect(response.body).toHaveLength(2);
});

test('first note is about HTML', async () => {
    const response = await api.get('/api/notes');
    expect(response.body[0].content).toBe('HTML is easy');
});

test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map(note => note.content);
    expect(contents).toContain('Browser can execute only Javascript');
});

afterAll(() => {
    mongoose.connection.close();
});