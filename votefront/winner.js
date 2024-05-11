  // Function to fetch winner data from the server
  function fetchWinnerData() {
    fetch('/winner')
        .then(response => response.json())
        .then(data => {
            // Update the winner name
            document.getElementById('winnerName').textContent += ' ' + data.winner;

            // Update the winner image
            const winnerImage = document.getElementById('winnerImage');
            winnerImage.src = data.winningImagePath;
            winnerImage.alt = 'Winner Candidate Image';
        })
        .catch(error => console.error('Error fetching winner data:', error));
}

// Call the function to fetch winner data when the page loads
window.onload = fetchWinnerData;




