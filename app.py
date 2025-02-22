from flask import Flask
from flask import render_template

app = Flask(__name__)

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

if __name__ == "__main__":
    app.run(debug=True)