const express = require('express');
const router = express.Router();
const path = require('path');
const { registerUser } = require('./userController');
const { submitVote } = require('./voteController');

// Route to serve the registration page
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'votefront', 'register.html'));
});

// Route to serve the voting page
router.get('/vote', (req, res) => {
    res.sendFile(path.join(__dirname, 'votefront', 'vote.html'));
});

// Route to handle user registration
router.post('/register', (req, res) => {
    registerUser(req.body)
        .then(newUser => res.json(newUser))
        .catch(error => res.status(500).json({ error: error.message }));
});

// Route to handle vote submission
router.post('/vote', submitVote);

module.exports = router;