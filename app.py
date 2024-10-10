from flask import Flask, render_template, jsonify, request


app = Flask(__name__)

# home Page
@app.route("/")
def homePage():
    return render_template('index.html', main_img="./static/images/mainHero.png")

# login page
@app.route("/login")
def logPage():
    return render_template('index.html', main_img="./static/images/mainHero.png", auth="log")

# sign up Page
@app.route("/signup")
def signupPage():
    return render_template('index.html', main_img="./static/images/mainHero.png", auth="signup")

# Forget password
@app.route("/forgetpassword")
def forgetPass(): 
    return render_template('index.html', main_img="./static/images/mainHero.png", auth="forgetpassword")
# About Page
@app.route("/about")
def about():
    return render_template('aboutUs.html', main_img="./static/images/mainHero.png", img_About_1="./static/images/About 1.webp",
        img_about="./static/images/about.webp", img_image_1="./static/images/image 1.webp", img_image_2="./static/images/image 2.webp", img_image_3="./static/images/image 3.webp" )

# Contact Page
@app.route('/contact')
def contact():
    return render_template('contact.html', main_img="./static/images/mainHero.png", img_contact="./static/images/contact.webp")

# submit btn request
@app.route("/submit", methods=['POST'])
def submit():
    data = request.get_json()
    print([data["text"]])
    return jsonify("hello from the backend")

if __name__ == '__main__':
    app.run()