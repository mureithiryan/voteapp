document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    axios.post("http://localhost:3000/register", { username, password })
        .then(response => {
            alert("User registered successfully");
           window.location.href = 'vote.html'; // Redirect to voting page
        })
        .catch(error => {
            if (error.response) {
                // The request was made and the server responded with a status code
                if (error.response.status === 409) {
                    alert("Username already exists. Please choose a different username.");
                } else {
                    console.error("Error registering user:", error);
                    alert("Error registering user.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                alert("No response received from server.");
            } else {
                // Something happened in setting up the request that triggered an error
                console.error("Error setting up request:", error.message);
                alert("Error setting up request.");
            }
        })
    });