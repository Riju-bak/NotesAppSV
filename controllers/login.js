const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const loginRouter = require('express').Router();

loginRouter.post('/', async (req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username: username});

    const passwordCorrect = user === null ? false : await bcrypt.compare(password, user.passwordHash);

    if(!(user && passwordCorrect)){
        res.status(401).json({
            error: `invalid username or password`
        });
    }

    const userForToken = {
        username: user.username,
        id: user._id
    };

    // const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60*60});
    //NOTE: Setting a non-expiring token now just for practice
    const token = jwt.sign(userForToken, process.env.SECRET);
    res.status(200)
        .send({token, username: user.username, name: user.name});
});

module.exports = loginRouter;