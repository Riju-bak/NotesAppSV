require('dotenv').config()

const PORT = process.env.PORT;
const MONGODB_URI = process.env.NODE_ENV==='test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const baseUrl = 'http://localhost:3002';
const notesAPIBaseUrl = '/api/notes';
const userAPIBaseUrl = '/api/users';
const loginBaseUrl = '/api/login';

module.exports = {
    PORT,
    MONGODB_URI,
    baseUrl,
    notesAPIBaseUrl,
    userAPIBaseUrl,
    loginBaseUrl
};