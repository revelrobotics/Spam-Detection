from flask import Flask, render_template, jsonify, request, Response
from inference import predict
import json
app = Flask(__name__)

# home Page
@app.route("/")
def homePage():
    return render_template('index.html', main_img="./static/images/mainHero.png")

# login page
@app.route("/login", methods=["GET", "POST"])
def logPage():
    if request.method == 'GET':
        return render_template('index.html', main_img="./static/images/mainHero.png", auth="log")
    elif request.method == 'POST':
        data = request.get_json()
        print(data)
        response = Response(
        response=   json.dumps("hello from the backend"),
        status=200,
        mimetype='application/json'
    )
    return response

# sign up Page
@app.route("/signup", methods=['GET', 'POST'])
def signupPage():
    if request.method == 'GET':
        return render_template('index.html', main_img="./static/images/mainHero.png", auth="signup")
    elif request.method == 'POST':
        data = request.get_json()
        print(data)
        response = Response(
        response=  json.dumps("hello from the backend"),
        status=200,
        mimetype='application/json'
    )
    return response

# Forget password
@app.route("/forgetpassword", methods=['GET', 'POST'])
def forgetPass(): 
    if request.method == 'GET':
        return render_template('index.html', main_img="./static/images/mainHero.png", auth="forgetpassword")
    elif request.method == 'POST':
        data = request.get_json()
        print(data)
        response = Response(
        response=  json.dumps("hello from the backend"),
        status=200,
        mimetype='application/json'
    )
    return response
# About Page
@app.route("/about")
def about():
    return render_template('aboutUs.html', main_img="./static/images/mainHero.png", img_About_1="./static/images/About 1.webp",
        img_about="./static/images/about.webp", img_image_1="./static/images/image 1.webp", img_image_2="./static/images/image 2.webp", img_image_3="./static/images/image 3.webp" )

# Contact Page
@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'GET':
        return render_template('contact.html', main_img="./static/images/mainHero.png", img_contact="./static/images/contact.webp")
    elif request.method == 'POST':
        data = request.get_json()
        print(data)
        response = Response(
        response=  json.dumps("hello from the backend"),
        status=200,
        mimetype='application/json'
    )
    return response



if __name__ == '__main__':
    app.run()