const mongoose = require('mongoose');
const {stringify} = require("nodemon/lib/utils");
const {model} = require("mongoose");

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    notes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
});

userSchema.set('toJSON', {
    transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        //passwordHash should not be revealed
        delete ret.passwordHash;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;