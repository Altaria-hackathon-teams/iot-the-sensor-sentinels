from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from ultralytics import YOLO
from PIL import Image
import io
import base64
import json
import asyncio
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load your custom-trained YOLOv8 model
try:
    model = YOLO("best.pt")
    logger.info("✅ YOLO model loaded successfully.")
except Exception as e:
    logger.error(f"❌ Error loading YOLO model: {e}")
    exit()


class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(
            f"✅ Client connected. Total connections: {len(self.active_connections)}"
        )

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        logger.info(
            f"❌ Client disconnected. Total connections: {len(self.active_connections)}"
        )

    async def send_personal_message(self, message: dict, websocket: WebSocket):
        await websocket.send_json(message)


manager = ConnectionManager()


def process_image(image_data: str):
    """Process image and return detections"""
    try:
        # Extract base64 image data
        if "," in image_data:
            header, encoded = image_data.split(",", 1)
        else:
            encoded = image_data

        image_bytes = base64.b64decode(encoded)
        image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    except Exception as e:
        logger.error(f"Error decoding image: {e}")
        return {"error": "Failed to decode image"}

    try:
        # Run YOLO inference
        results = model(image, conf=0.4, verbose=False)

        # Process results
        detections = []
        img_width, img_height = image.size

        for result in results:
            for box in result.boxes:
                # Original coordinates [x1, y1, x2, y2]
                coords = box.xyxy[0].tolist()
                class_name = model.names[int(box.cls[0])]
                confidence = float(box.conf[0])

                # Add padding to shrink bounding box
                padding_factor = 0.05
                x1, y1, x2, y2 = coords
                box_width = x2 - x1
                box_height = y2 - y1

                # Calculate the padding to add/subtract
                x_padding = box_width * padding_factor
                y_padding = box_height * padding_factor

                # Apply the padding to shrink the box
                new_x1 = x1 + x_padding
                new_y1 = y1 + y_padding
                new_x2 = x2 - x_padding
                new_y2 = y2 - y_padding

                # Ensure the new box is still valid
                if new_x1 < new_x2 and new_y1 < new_y2:
                    shrunken_coords = [new_x1, new_y1, new_x2, new_y2]
                else:
                    shrunken_coords = coords

                detections.append(
                    {
                        "box": shrunken_coords,
                        "label": class_name,
                        "confidence": confidence,
                        "image_width": img_width,
                        "image_height": img_height,
                    }
                )

        return {
            "detections": detections,
            "image_width": img_width,
            "image_height": img_height,
        }

    except Exception as e:
        logger.error(f"Error processing detection: {e}")
        return {"error": str(e)}


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Wait for message from client
            data = await websocket.receive_text()
            message = json.loads(data)

            if message.get("type") == "process_frame":
                # Process the frame
                result = process_image(message["data"])
                # Send back the results
                await manager.send_personal_message(
                    {"type": "detection_results", "data": result}, websocket
                )

            elif message.get("type") == "ping":
                await manager.send_personal_message(
                    {"type": "pong", "data": {"message": "pong"}}, websocket
                )

    except WebSocketDisconnect:
        manager.disconnect(websocket)


@app.get("/")
async def root():
    return {"message": "YOLOv8 Detection Server is running"}


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    logger.info("🚀 Starting FastAPI detection server on http://10.100.7.15:8080")
    uvicorn.run(app, host="0.0.0.0", port=5001, log_level="info")
