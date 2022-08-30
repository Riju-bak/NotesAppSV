const userRouter = require('express').Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

userRouter.post('/', async (req, res) => {
    const {username, name, password} = req.body;

    const existingUser = await User.findOne({username: username});
    if (existingUser) {
        res.status(400).json({error: `username ${username} already taken`});
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const newUser = new User({
        username: username,
        name: name,
        passwordHash: passwordHash
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (e) {
        console.log(`Create User error: ${e}`);
    }

});

userRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('notes', {content: 1, date: 1});
    res.json(users);
});

module.exports = userRouter;