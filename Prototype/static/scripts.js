document.getElementById('spamForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const email_address = document.getElementById('email_address').value;
    const body = document.getElementById('body').value;
    const footer = document.getElementById('footer').value;

    fetch('/check_spam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email_address, body, footer })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('result').innerHTML = data.html_output;
    })
    .catch(error => console.error('Error:', error));
});
