import os
import torch
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
from io import BytesIO
import base64

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable Cross-Origin requests

class YOLO:
    def __init__(self, model_path='yolov5s.pt'):
        """Load the YOLO model from the specified local path."""
        # Check if the model file exists locally
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model weights not found at {model_path}. Please download the YOLOv5 model and save it locally.")
        
        # Load the model from the local path
        self.model = torch.hub.load('ultralytics/yolov5', 'custom', path=model_path, force_reload=False)

    def detect(self, img_np):
        """Perform object detection on a given image (in NumPy format)."""
        results = self.model(img_np)

        # Parse results and return detections
        detections = []
        for *box, conf, cls in results.xyxy[0]:
            detections.append({
                'bbox': [int(x) for x in box],  # Bounding box coordinates
                'confidence': float(conf),  # Confidence score
                'class': self.model.names[int(cls)]  # Class name
            })
        return detections

# Load YOLOv5 model (download a pretrained model if needed)
model = YOLO(model_path='yolov5s.pt')

def preprocess_image(image_bytes):
    """Convert the image bytes to a NumPy array and process with OpenCV."""
    img = Image.open(BytesIO(image_bytes))
    img_np = np.array(img)
    # Convert RGB to BGR (OpenCV standard)
    img_np = cv2.cvtColor(img_np, cv2.COLOR_RGB2BGR)
    return img_np

@app.route('/detect', methods=['POST'])
def detect_objects():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    # Read image from POST request
    image_file = request.files['image']
    image_bytes = image_file.read()

    # Preprocess the image (convert to NumPy array for YOLO)
    img_np = preprocess_image(image_bytes)

    # Perform object detection
    detections = model.detect(img_np)

    return jsonify(detections)

@app.route('/')
def index():
    return "Object detection API using YOLO"

if __name__ == '__main__':
    app.run(debug=True)
