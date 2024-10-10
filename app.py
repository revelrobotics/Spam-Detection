from flask import Flask, render_template,jsonify,  request, Response
from inference import predict
from flask_jwt_extended import JWTManager, create_access_token, JWTManager, get_jwt_identity, jwt_required
from flask_bcrypt import Bcrypt
import json
import pymongo

# App configuration
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "This is spam detector super secret key" 
app.config['JWT_TOKEN_LOCATION'] = ['headers']
jwt = JWTManager(app)
bcrypt = Bcrypt(app)

# Database
myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["mydatabase"]
mycol = mydb["users"]






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
        x = mycol.find_one({"email":data["email"]})
        if x is None:
            return jsonify("hellow from the backend"), 400
        else:
            if bcrypt.check_password_hash(x["password"], data["password"]):
                access_token = create_access_token(identity=data["email"])
                return jsonify(access_token=access_token), 200
            else:
                return jsonify("Invalid Password or Email"), 401

    return jsonify("hellow from the backend"), 400

# sign up Page
@app.route("/signup", methods=['GET', 'POST'])
def signupPage():

    if request.method == 'GET':
        return render_template('index.html', main_img="./static/images/mainHero.png", auth="signup")
    
    elif request.method == 'POST':
        data = request.get_json()
        user =  mycol.find_one({"email":data["email"]})
        if user is not None:
            return jsonify("hellow from the backend"), 409
        userDict = {
            "username":data["username"],
            "email":data["email"],
            "password": bcrypt.generate_password_hash(data["password"])
        }
        x = mycol.insert_one(userDict)
        print(x.inserted_id)
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
    return jsonify(logged_in_as=current_user), 200



# Forget password
@app.route("/forgetpassword", methods=['GET', 'POST'])
def forgetPass(): 
    if request.method == 'GET':
        return render_template('index.html', main_img="./static/images/mainHero.png", auth="forgetpassword")
    elif request.method == 'POST':
        data = request.get_json()
        x = mycol.find_one({"email":data["email"]})
        if x is not None:
            querry = {"email":data["email"]}
            value = {"$set": {"password": bcrypt.generate_password_hash(data["password"])}}
            mycol.update_one(querry,value)
            y = mycol.find_one({"email":data["email"]})
            access_token = create_access_token(identity=y["email"])
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
        print(data)
        response = Response(
        response=  json.dumps("hello from the backend"),
        status=200,
        mimetype='application/json'
    )
    return response

@app.route("/submit", methods=['POST'])
@jwt_required()
def submit():
    data = request.get_json()
    current_user = get_jwt_identity()
    if current_user:
        x = mycol.find_one({"email":current_user})
        if x is not None:
            if predict([data["text"]]) == "Spam":
                return jsonify("Spam"),200
            elif predict([data["text"]]) == 'Not Spam':
                return jsonify("Not Spam"),300
    return jsonify("Hello from backend"), 400


if __name__ == '__main__':
    app.run()