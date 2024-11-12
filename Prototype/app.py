from flask import Flask, render_template, request, jsonify
import markdown
from inference import run_spam_detection 

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/check_spam', methods=['POST'])
def check_spam():
    email_address = request.form['email_address']
    body = request.form['body']
    footer = request.form['footer']

    # Run spam detection
    markdown_output = run_spam_detection(email_address, body, footer)

    # Convert markdown to HTML
    html_output = markdown.markdown(markdown_output)
    return jsonify(html_output=html_output)

if __name__ == '__main__':
    app.run(debug=True)
