// userController.js
const db = require('./db');

// Function to register a new user
exports.registerUser = (userData) => {
    return new Promise((resolve, reject) => {
        // Extract user data
        const { username, password } = userData;

        // Perform validation (if needed)

        // Perform database operation to insert user
        const sql = "INSERT INTO users (username, password) VALUES (?, ?)";
        db.query(sql, [username, password], (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};