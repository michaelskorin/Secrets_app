require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const localDB = 'mongodb://localhost:27017/userDB';
const bcrypt = require('bcrypt'); // for hashing
const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect(localDB, {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/register', (req, res) => {
    res.render('register');
})

app.post('/register', (req, res) => {

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            // Store hash in your password DB.
            const newUser = new User({
                email: req.body.username,
                password: hash
            });
            newUser.save(err => {
                if (!err) {
                    console.log('User saved successfully');
                    res.render('secrets');
                } else {
                    console.log(err);
                }
            });
        });
    });

});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username}, (err, foundUser) => {
        if (err) {
            console.log(err);
        } else if (foundUser) {
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if (result === true) {
                    res.render('secrets');
                }
            });
        } 
    });
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
    
});

