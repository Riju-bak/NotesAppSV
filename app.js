const mongoose = require('mongoose');
const notesRouter = require('./controllers/notes');
const userRouter = require("./controllers/users");
const logger = require('./utils/logger');
const config = require('./utils/config');
const express = require('express');
require('express-async-errors');
const app = express();
const cors = require('cors');
const middleware = require('./utils/middlewares');
const loginRouter = require("./controllers/login");

logger.info(`Connecting to MongoDB`);

mongoose.connect(config.MONGODB_URI)
    .then(res => logger.info(`Connected to MongoDB`))
    .catch(err => logger.error('Error connecting to MongoDB', err.message));

app.use(cors());
app.use(express.static('build')); //whenever express gets an HTTP GET request it will first check if the build directory contains a file corresponding to the request's address.
// Now HTTP GET requests to the address www.serversaddress.com/index.html or www.serversaddress.com will show the React frontend.
// GET requests to the address www.serversaddress.com/api/notes will be handled by the backend's code.

app.use(express.json()); //Without this req.body for POST will be undefined.

app.use(config.notesAPIBaseUrl, notesRouter);
app.use(config.userAPIBaseUrl, userRouter);

app.use(config.loginBaseUrl, loginRouter);

app.use(middleware.requestLogger);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndpoint);

module.exports = app;