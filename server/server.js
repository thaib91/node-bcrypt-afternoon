require('dotenv').config();
const ac = require('./controllers/authController');
const express = require('express');
const session = require('express-session');
const massive = require('massive');
// const bcrypt = require('bcryptjs')
const { CONNECTION_PORT, SERVER_PORT, SECRET } = process.env;

const app = express();
massive(CONNECTION_PORT).then(db => {
    app.set('db', db)
})
app.use(express.json());
app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}))

app.post('/auth/register', ac.register);
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)


app.listen(SERVER_PORT, () => console.log(`listening on port ${SERVER_PORT}`))