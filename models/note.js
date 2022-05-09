const mongoose = require('mongoose');
require('dotenv').config()

const url = process.env.MONGODB_URI;
console.log(`Connecting to MongoDB`);

mongoose.connect(url)
    .then(res => console.log(`Connected to MongoDB`))
    .catch(err => console.log(`error connecting to MongoDB: ${err}`));

const noteSchema = new mongoose.Schema({
    content: {
        type: String,
        minLength: 5,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    important: Boolean
});

noteSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
    }
});

module.exports = mongoose.model('Note', noteSchema);

