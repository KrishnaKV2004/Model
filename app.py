import io
import os
import numpy as np
from PIL import Image
import tensorflow as tf
from dotenv import load_dotenv
from flask import Flask, request, jsonify, render_template, redirect, session, url_for

app = Flask(__name__)

load_dotenv()

app.secret_key = os.getenv('FLASK_SECRET_KEY', 'default_fallback_key')

# Load the trained model once at startup
tumor_model = tf.keras.models.load_model("brain-tumor.keras")
print("Model Loaded Successfully !")

# Define function to preprocess the image
def preprocess_image(image):
    img = image.resize((128, 128))  # Ensure correct input size
    img = np.array(img) / 255.0     # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

USERNAME = "Krishna2004"
PASSWORD = "KrishnaBT"

@app.route('/')
def home():
    return render_template("home.html", page="home")

@app.route('/model')
def model():
    return render_template("home.html", page="model")

@app.route('/about')
def about():
    return render_template("home.html", page="about")

@app.route('/help')
def help():
    return render_template("home.html", page="help")

@app.route('/profile')
def profile():
    return render_template("home.html", page="profile")


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        if username == USERNAME and password == PASSWORD:
            session['username'] = username
            return redirect(url_for('home'))
        else:
            error = "Invalid username or password!"
            return render_template("login.html", error=error)
    
    return render_template("login.html")

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('login'))

@app.route('/predict', methods=['POST'])
def predict():

    if 'file' not in request.files:
        return jsonify({"error": "No File Uploaded !"})

    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No Selected File !"})

    try:
        # Open and preprocess the image
        image = Image.open(io.BytesIO(file.read()))
        processed_image = preprocess_image(image)

        # Predict the tumor type
        prediction = tumor_model.predict(processed_image)
        print("Prediction : ", prediction)
        result_index = np.argmax(prediction)
        print("Predicted Class Index : ", result_index)

        # Class labels
        class_names = ['Glioma', 'Meningioma', 'Normal', 'Pituitary']
        predicted_class = class_names[result_index]
        confidence = np.max(prediction) * 100

        return jsonify({
            "prediction": predicted_class,
            "confidence": f"{confidence:.2f}%"
        })

    except Exception as e:
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run(debug=True)