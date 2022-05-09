const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://gg:${password}@cluster0.7o7lo.mongodb.net/NotesApp?retryWrites=true&w=majority`

mongoose.connect(url)

const noteSchema = new mongoose.Schema({
    content: String,
    date: Date,
    important: Boolean,
})

const Note = mongoose.model('Note', noteSchema)

const note1 = new Note({
    content: 'Star Platinum',
    date: new Date(),
    important: true,
})

const note2 = new Note({
    content: `Heaven's Door`,
    date: new Date(),
    important: false,
})

// note1.save().then(result => {
//     console.log('note1 saved!')
// })
//
// note2.save().then(result => {
//     console.log('note2 saved!')
//     mongoose.connection.close()
// })

Note.find({}).then(result => {
    result.forEach(note => {
        console.log(note)
    })
    mongoose.connection.close()
})