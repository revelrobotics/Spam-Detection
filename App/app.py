from flask import Flask, render_template,jsonify,  request, Response
from inference import predict
from flask_jwt_extended import JWTManager, create_access_token, JWTManager, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt
import json
import sqlite3
# App configuration
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "This is spam detector super secret key" 
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Database
connection = sqlite3.connect("spam_detector.db", check_same_thread=False)
cursor = connection.cursor()

# creating user table
cursor.execute("""CREATE TABLE IF NOT EXISTS 
users(user_id INTEGER PRIMARY KEY, username TEXT, email TEXT, password TEXT)
""")



# home Page
@app.route("/")
def homePage():
    return render_template('index.html' )

# login page
@app.route("/login", methods=["GET", "POST"])
def logPage():
    if request.method == 'GET':
        return render_template('login.html')
    elif request.method == 'POST':
        data = request.get_json()
        # checking the databse to see user existence
        cursor.execute(f"SELECT password from users where email='{data['email']}'")
        x = cursor.fetchone()
        if x is None:
            return jsonify("hellow from the backend"), 400
        else:
            if bcrypt.check_password_hash(x[0], data["password"]):
                access_token = create_access_token(identity=data["email"])
                return jsonify(access_token=access_token), 200
            else:
                return jsonify("Invalid Password or Email"), 401

    return jsonify("hellow from the backend"), 400

# sign up Page
@app.route("/signup", methods=['GET', 'POST'])
def signupPage():

    if request.method == 'GET':
        return render_template('signup.html', main_img="./static/images/mainHero.png")
    
    elif request.method == 'POST':
        data = request.get_json()
        # checking the user existance
        cursor.execute(f"SELECT * from users where email='{data['email']}'")
        user = cursor.fetchone()
        if user is not None:
            return jsonify("hellow from the backend"), 409

        # creating a new user
        password = bcrypt.generate_password_hash(data["password"]).decode('utf-8') 
        cursor.execute(f"""INSERT INTO users(username, email, password) VALUES
    ('{data['username']}', '{data['email']}', '{password}')""")
        connection.commit()
        # returning the JWT token
        access_token = create_access_token(identity=data["email"])
        return jsonify(access_token=access_token)
    
    return Response(
        response = json.dumps("Invalide Request"),
        status=400,
        mimetype='application/json'
    )


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    if current_user:
        cursor.execute(f"SELECT * from users where email='{current_user}'")
        user = cursor.fetchone()
        if user is None:
                return jsonify("hellow from the backend"), 409
        else:
            return jsonify("okay")
    return jsonify("Server Error"), 500



# Forget password
@app.route("/forgetpassword", methods=['GET', 'POST'])
def forgetPass(): 
    if request.method == 'GET':
        return render_template('index.html', main_img="./static/images/mainHero.png", auth="forgetpassword")
    elif request.method == 'POST':
        data = request.get_json()
        # fetching the user
        cursor.execute(f"SELECT * from users where email='{data['email']}'")
        user = cursor.fetchone()
        if user is not None:
            # updating the password
            new_password = bcrypt.generate_password_hash(data["password"]).decode('utf-8') 
            cursor.execute(f"""UPDATE users
                    SET 
                        password = '{new_password}'""")
            # returning the access token
            connection.commit()
            access_token = create_access_token(identity=data["email"])
            return jsonify(access_token=access_token), 201
    return jsonify("hello from the backend"), 400



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
    return jsonify("hello from the backend"), 200

@app.route("/submit", methods=['POST'])
def submit():
    data = request.get_json()
    result = predict([data['text']])
    if result == "Spam":
        return jsonify("Spam"),200
    elif result == "Not Spam":
        return jsonify("Not Spam"),300
    return jsonify("hello from the Server"),400
if __name__ == '__main__':
    app.run()
