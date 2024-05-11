const db = require('./db'); 

// Function to handle vote submission
const submitVote = (user_id, selectedCandidateId, selectedCandidateName) => {
    return new Promise((resolve, reject) => {
        // Insert the vote into the database
        const insertSql = 'INSERT INTO votes_table (user_id, candidates_id, candidates_name) VALUES (?, ?, ?)';
        db.query(insertSql, [user_id, selectedCandidateId, selectedCandidateName], (err, result) => {
            if (err) {
                console.error('Error inserting vote into database:', err);
                return reject('Internal server error');
            }
            console.log('Vote inserted successfully');
            resolve('Vote submitted successfully');
        });
    });
};

module.exports = {submitVote};