document.addEventListener('DOMContentLoaded', function() {
    const voteForm = document.getElementById('voteForm');
    const successMessage = document.getElementById('successMessage');

    // Add event listener to form submission
    voteForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the selected candidate's ID and name from the form
        const selectedCandidateRadio = document.querySelector('input[name="selectedCandidateId"]:checked');
        
        // Check if a radio button is checked
        if (selectedCandidateRadio) {
            const selectedCandidateId = selectedCandidateRadio.value;
            const selectedCandidateName = selectedCandidateRadio.dataset.name;

            // Construct the body of the fetch request
            const body = JSON.stringify({ selectedCandidateId, selectedCandidateName });

            // Send the vote data to the server
            fetch('/vote', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // Display a success message to the user
                successMessage.textContent = 'Vote submitted successfully!';
                  // Redirect to winner page after a delay
                  setTimeout(() => {
                    window.location.href = 'winner.html';
                }, 2000); // Adjust the delay time as needed 
            })
            
            .catch(error => {
                console.error('Error submitting vote:', error);
                // Optionally, display an error message to the user
            });
        } else {
            console.error('No candidate selected');
            // Optionally, display a message to the user indicating that no candidate was selected
        }
    });
});