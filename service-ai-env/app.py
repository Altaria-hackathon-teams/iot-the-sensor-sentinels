import pandas as pd
import joblib
import os
import json
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from flask import Flask, request, jsonify
from flask_sock import Sock
from flask_cors import CORS
import logging
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app with CORS
app = Flask(__name__)
CORS(
    app,
    origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    supports_credentials=True,
)
sock = Sock(app)

# Configure Gemini for Voice Assistant
API_KEY = os.getenv("GOOGLE_API_KEY")
if API_KEY:
    genai.configure(api_key=API_KEY)
    voice_model = genai.GenerativeModel('models/gemini-flash-latest')
    logger.info("✅ Gemini Voice Assistant initialized.")
else:
    voice_model = None
    logger.warning("⚠️ GOOGLE_API_KEY not found. Voice assistant will be limited.")

# Global state to store latest sensor data
latest_sensor_data = {
    "Soil_Moisture": 45.0,
    "Soil_Temperature": 24.0,
    "Humidity": 60.0
}

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


# Load models
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


@app.route("/api/auth/logout", methods=["POST"])
def logout():
    """Logout endpoint"""
    return jsonify({"message": "Logged out"}), 200


@app.route("/api/auth/check-session", methods=["GET"])
def check_session():
    """Endpoint for session checking"""
    logger.info("🔐 Session check requested")
    return jsonify(
        {
            "authenticated": True,
            "user": {"id": 1, "email": "demo@example.com", "name": "Demo User"},
        }
    )


@app.route("/api/voice/query", methods=["POST"])
def voice_query():
    """Endpoint for processing voice/text queries with sensor context"""
    if not voice_model:
        return jsonify({"error": "Voice assistant model not configured. Please set GOOGLE_API_KEY in .env"}), 500

    data = request.json
    query = data.get("query")
    language = data.get("language", "english")

    if not query:
        return jsonify({"error": "No query provided"}), 400

    logger.info(f"🎤 Voice Query: {query} ({language})")

    # Get latest predictions for context
    status, suggestions = predict_and_recommend(latest_sensor_data)

    # Construct context-aware prompt
    context_prompt = f"""
    You are 'AgnI', a specialized AI Agricultural Assistant for smart farming.
    Current Sensor Data:
    - Soil Moisture: {latest_sensor_data['Soil_Moisture']}%
    - Soil Temperature: {latest_sensor_data['Soil_Temperature']}°C
    - Humidity: {latest_sensor_data['Humidity']}%

    Current Plant Health Status: {status}
    Recommendations: {', '.join(suggestions) if suggestions else 'None'}

    The user is asking: "{query}"

    Please provide a concise, helpful response in {language}.
    If the user asks about the farm or crops, use the current sensor data to give specific advice.
    Keep it conversational and farmer-friendly. Respond in 2-3 sentences max.
    """

    try:
        response = voice_model.generate_content(context_prompt)
        return jsonify({
            "response": response.text,
            "status": status,
            "suggestions": suggestions
        })
    except Exception as e:
        logger.error(f"❌ Gemini Error: {e}")
        return jsonify({"error": "Failed to generate AI response", "details": str(e)}), 500


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
            "message": "Server is running fine ✅",
        }
    )


@sock.route("/ws")
def websocket_handler(ws):
    clients.add(ws)
    logger.info(f"📲 Client connected. Total clients: {len(clients)}")

    try:
        welcome_msg = {
            "type": "welcome",
            "message": "Connected to AgnI Sensor Server",
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

                # Update global sensor state
                global latest_sensor_data
                latest_sensor_data.update(sensor_readings)

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
                    clients.discard(client)

                logger.info(f"📤 Broadcasted results to {len(clients)} client(s).")

            except json.JSONDecodeError as e:
                logger.error(f"❌ JSON decode error: {e}")
                ws.send(json.dumps({"error": "Invalid JSON format"}))
            except Exception as e:
                logger.error(f"❌ Error processing message: {e}")
                ws.send(json.dumps({"error": "Processing error"}))

    except Exception as e:
        logger.error(f"❌ WebSocket error: {e}")
    finally:
        clients.discard(ws)
        logger.info(f"📴 Client disconnected. Total clients: {len(clients)}")


if __name__ == "__main__":
    logger.info("\n🚀 Starting AgnI Flask Server...")
    logger.info("WebSocket available at ws://0.0.0.0:5002/ws")
    logger.info("HTTP endpoints at http://0.0.0.0:5002/")
    app.run(host="0.0.0.0", port=5002, debug=True)
