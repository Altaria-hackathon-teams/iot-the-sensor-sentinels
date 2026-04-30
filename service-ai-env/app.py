import pandas as pd
import joblib
import os
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from flask import Flask, request, jsonify
from flask_sock import Sock
from flask_cors import CORS  # Add this import
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app with CORS
app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    supports_credentials=True,
)  # Add this line
sock = Sock(app)

# Your existing model training and loading code remains the same...
clients = set()


def train_and_save_model():
    logger.info("Training new model from plant_health_data.csv...")
    try:
        df = pd.read_csv("plant_health_data.csv")
        logger.info(f"Dataset loaded with {len(df)} rows")
    except FileNotFoundError:
        logger.error("❌ 'plant_health_data.csv' not found.")
        return False

    features = ["Soil_Moisture", "Soil_Temperature", "Humidity"]
    target = "Plant_Health_Status"

    le = LabelEncoder()
    df[target] = le.fit_transform(df[target])

    X = df[features]
    y = df[target]

    X_train, _, y_train, _ = train_test_split(X, y, test_size=0.2, random_state=42)
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)

    healthy_encoded_value = le.transform(["Healthy"])[0]
    healthy_plants_data = df[df[target] == healthy_encoded_value]
    average_healthy_values = healthy_plants_data[features].mean()

    joblib.dump(model, "plant_health_model.pkl")
    joblib.dump(le, "label_encoder.pkl")
    joblib.dump(average_healthy_values, "healthy_averages.pkl")

    logger.info("✅ Model, Encoder, and Averages saved to .pkl files.")
    return True


# Load models (your existing code)
MODEL_FILES = ["plant_health_model.pkl", "label_encoder.pkl", "healthy_averages.pkl"]

if not all(os.path.exists(f) for f in MODEL_FILES):
    logger.info("Model files not found, training new model...")
    if not train_and_save_model():
        logger.error("Failed to train model. Exiting.")
        exit()
else:
    logger.info("Model files found, loading...")

try:
    model = joblib.load("plant_health_model.pkl")
    le = joblib.load("label_encoder.pkl")
    average_healthy_values = joblib.load("healthy_averages.pkl")
    logger.info("🧠 ML Model and helper files loaded successfully.")
except Exception as e:
    logger.error(f"❌ Error loading models: {e}")
    exit()


def predict_and_recommend(sensor_data):
    logger.info(f"📊 Predicting for sensor data: {sensor_data}")
    try:
        input_df = pd.DataFrame(
            [sensor_data], columns=["Soil_Moisture", "Soil_Temperature", "Humidity"]
        )
        prediction_encoded = model.predict(input_df)[0]
        prediction_label = le.inverse_transform([prediction_encoded])[0]
        logger.info(f"🔮 Prediction: {prediction_label}")

        recommendations = []
        if prediction_label != "Healthy":
            for feature in ["Soil_Moisture", "Soil_Temperature", "Humidity"]:
                current_val = sensor_data[feature]
                healthy_val = average_healthy_values[feature]
                diff = healthy_val - current_val
                if abs(diff) > 0.1:
                    recommendations.append(
                        f"{'Increase' if diff > 0 else 'Decrease'} {feature.replace('_', ' ')} by {abs(diff):.2f}"
                    )
        return prediction_label, recommendations
    except Exception as e:
        logger.error(f"❌ Prediction error: {e}")
        return "Error", [f"Prediction failed: {str(e)}"]


# Add a health check endpoint for your auth context
@app.route("/api/auth/check-session", methods=["GET"])
def check_session():
    """Endpoint for session checking - fix for the auth error"""
    logger.info("🔐 Session check requested")
    return jsonify(
        {
            "authenticated": True,
            "user": {"id": 1, "email": "demo@example.com", "name": "Demo User"},
        }
    )


@app.route("/test")
def test_data():
    """Test endpoint to verify the server is working"""
    test_sensor_data = {
        "Soil_Moisture": 45.5,
        "Soil_Temperature": 22.0,
        "Humidity": 65.0,
    }
    status, suggestions = predict_and_recommend(test_sensor_data)
    return jsonify(
        {
            "live_data": test_sensor_data,
            "plant_health_status": status,
            "improvement_suggestions": suggestions,
            "message": "Test endpoint working",
        }
    )


@sock.route("/ws")
def websocket_handler(ws):
    clients.add(ws)
    logger.info(f"📲 Client connected. Total clients: {len(clients)}")

    try:
        welcome_msg = {
            "type": "welcome",
            "message": "Connected to Environmental Assessment Server",
            "clients_count": len(clients),
        }
        ws.send(json.dumps(welcome_msg))

        while True:
            message = ws.receive()
            if message is None:
                break

            logger.info(f"📩 Received message: {message}")

            try:
                sensor_readings = json.loads(message)
                status, suggestions = predict_and_recommend(sensor_readings)

                response_payload = {
                    "live_data": sensor_readings,
                    "plant_health_status": status,
                    "improvement_suggestions": suggestions,
                    "timestamp": pd.Timestamp.now().isoformat(),
                }

                disconnected_clients = []
                for client in list(clients):
                    try:
                        client.send(json.dumps(response_payload))
                    except Exception:
                        disconnected_clients.append(client)

                for client in disconnected_clients:
                    clients.remove(client)

                logger.info(f"📤 Broadcasted results to {len(clients)} client(s).")

            except json.JSONDecodeError as e:
                logger.error(f"❌ JSON decode error: {e}")
                error_msg = {"error": "Invalid JSON format"}
                ws.send(json.dumps(error_msg))
            except Exception as e:
                logger.error(f"❌ Error processing message: {e}")
                error_msg = {"error": "Processing error"}
                ws.send(json.dumps(error_msg))

    except Exception as e:
        logger.error(f"❌ WebSocket error: {e}")
    finally:
        if ws in clients:
            clients.remove(ws)
        logger.info(f"❌ Client disconnected. Total clients: {len(clients)}")


if __name__ == "__main__":
    logger.info("\n🚀 Starting Flask Server with CORS support...")
    logger.info("WebSocket is available at ws://0.0.0.0:9000/ws")
    logger.info("HTTP endpoints available at http://0.0.0.0:9000/")
    app.run(host="0.0.0.0", port=9000, debug=True)
