from flask import Flask, request, jsonify, render_template
import tensorflow as tf
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

# Load the trained model once at startup
tumor_model = tf.keras.models.load_model("brain-tumor.keras")
print("Model Loaded Successfully !")

# Define function to preprocess the image
def preprocess_image(image):
    img = image.resize((128, 128))  # Ensure correct input size
    img = np.array(img) / 255.0     # Normalize pixel values
    img = np.expand_dims(img, axis=0)  # Add batch dimension
    return img

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