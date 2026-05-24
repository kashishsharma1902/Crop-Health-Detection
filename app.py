

from flask import Flask, render_template, request
import numpy as np
import os
from tensorflow.keras.models import load_model
from PIL import Image
import webbrowser
import threading

app = Flask(__name__)

MODEL_PATH = "model.h5"
if not os.path.exists(MODEL_PATH):
    raise FileNotFoundError(
        f"Model file '{MODEL_PATH}' not found in {os.path.abspath(os.path.dirname(__file__))}. "
        "Place model.h5 next to app.py or update MODEL_PATH."
    )

# Load model lazily to avoid crashing the server if model.h5 is missing/corrupted.
# Also supports cases where model.h5 is a placeholder/partial download.
model = None

def get_model():
    global model
    if model is not None:
        return model
    model = load_model(MODEL_PATH)
    return model


UPLOAD_FOLDER = "static/uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

class_names = ["Tomato_Bacterial_spot", "Tomato_Early_blight", "Tomato_Late_blight"]

@app.route("/")
def home():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


def open_browser():
    webbrowser.open_new("http://127.0.0.1:5000/")

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return "No file part in request", 400

    file = request.files["file"]
    if not file or file.filename == "":
        return "No file uploaded", 400

    path = os.path.join(app.config["UPLOAD_FOLDER"], file.filename)
    file.save(path)

    img = Image.open(path).convert("RGB")
    img = img.resize((128, 128))
    img = np.array(img, dtype=np.float32) / 255.0
    img = np.expand_dims(img, axis=0)

    try:
        mdl = get_model()
        prediction = mdl.predict(img)
    except Exception as e:
        return render_template(
            "index.html",
            prediction=None,
            image=file.filename,
            error=f"Model could not be loaded or used: {e}",
        )



    confidence = float(np.max(prediction) * 100)
    result = class_names[int(np.argmax(prediction))]

    return render_template(
        "index.html",
        prediction=result,
        confidence=round(confidence, 2),
        image=file.filename,
    )

if __name__ == "__main__":
    # Open browser after server starts
    threading.Timer(1.5, open_browser).start()
    # Prevent multiple instances
    app.run(host="127.0.0.1", port=5000, debug=True, use_reloader=False)

