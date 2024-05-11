const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);// Import MySQLStore with express-session passed as an argument
const mysql = require('mysql');
const path = require('path');
const app = express();
const crypto = require('crypto');
const { DESTRUCTION } = require('dns');
const secretKey = crypto.randomBytes(32).toString('hex');
const router = express.Router('./router');
// Import the EJS module
const ejs = require('ejs');
app.use('/', router);
// Set EJS as the view engine
app.set('view engine', 'ejs');
// Set the directory for views
app.set('views', path.join(__dirname, 'views'));
const port  = process.env.PORT || 3000;

//middleware
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// Serve static files from the 'votefront' directory
app.use(express.static(path.join(__dirname, 'votefront')));
// Listen for server errors and success
app.listen(port, () => { console.log(`Server running on ${port}`)});
// Establish db connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'votedb',
});

db.connect(function (error){
    if(error){
        console.log("Error connecting to database");
    }else{
        console.log("Successfully connected to database");
    }
});

// Session store options
const sessionStoreOptions = {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'votedb'
};

// Initialize session middleware with MySQLStore
const sessionMiddleware = session({
    secret: secretKey, 
    resave: false,
    saveUninitialized: true,
    store: new MySQLStore(sessionStoreOptions)
});
//use session middleware
app.use(sessionMiddleware);

// Define route to render the register.html file

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'votefront', 'register.html'));
});

// Define the route handler for user registration
app.post('/register', (req, res) => {
    const { username, password } = req.body;

    // Validate input data
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    // Hash the password before storing it
    bcrypt.hash(password, 10, (hashErr, hash) => {
        if (hashErr) {
            console.error('Error hashing password:', hashErr);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Insert the user data into the database with hashed password
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, hash], (error, results) => {
            if (error) {
                console.error("Error registering user:", error);
                if (error.code === 'ER_DUP_ENTRY') { // MySQL duplicate entry error
                    return res.status(409).json({ message: 'Username already exists' });
                }
                return res.status(500).json({ message: 'Internal server error' });
            }
  // Set the user_id in the session after successful registration
  req.session.user_id = results.insertId;
            console.log("User registered successfully", results);
            return res.status(200).json({ message: "User registered successfully" });
        });
    });
});
// Route for the vote page
app.get('/vote', (req, res) => {
    res.sendFile(path.join(__dirname, 'votefront', 'vote.html'));
});
// Endpoint to handle vote submission
app.post('/vote', (req, res) => {
    // Retrieve user ID from session data
    const userId = req.session.user_id;

    // Check if userId is valid
    if (!userId) {
        console.error('User ID not found in session data');
        return res.status(401).json({ message: 'User is not authenticated' });
    }

    const { selectedCandidateId, selectedCandidateName } = req.body;

    // Check if selectedCandidateId and selectedCandidateName are provided
    if (!selectedCandidateId || !selectedCandidateName) {
        console.error('Candidate ID or name not provided');
        return res.status(400).json({ message: 'Candidate ID or name not provided' });
    }

    // Insert the vote into the database
    const insertSql = 'INSERT INTO votes_table (user_id, candidates_id, candidates_name) VALUES (?, ?, ?)';
    db.query(insertSql, [userId, selectedCandidateId, selectedCandidateName], (err, result) => {
        if (err) {
            console.error('Error inserting vote into database:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        console.log('Vote inserted successfully');

        // Send a success message to the user
        res.json({ message: 'Vote submitted successfully' });
    });
});

