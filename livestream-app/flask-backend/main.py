import torch
import cv2

# Load the YOLOv5 model
model = torch.hub.load('ultralytics/yolov5', 'custom', path='yolov5s.pt')

# Load and preprocess the image
img = 'bus.jpg'  # Replace with your image path
img_np = cv2.imread(img)

# Perform detection
results = model(img_np)

# Draw bounding boxes on the image
for *box, conf, cls in results.xyxy[0]:
    x1, y1, x2, y2 = map(int, box)
    label = f"{model.names[int(cls)]} {conf:.2f}"
    
    # Draw rectangle and label on the image
    cv2.rectangle(img_np, (x1, y1), (x2, y2), (0, 255, 0), 2)
    cv2.putText(img_np, label, (x1, y1 - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 0), 2)

# Display the image with detections
cv2.imshow('YOLO Object Detection', img_np)
cv2.waitKey(0)
cv2.destroyAllWindows()