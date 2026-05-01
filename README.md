# 🌱 Sakhi-Agri: Smart IoT & AI Agriculture Ecosystem

![Status](https://img.shields.io/badge/Status-Active-success.svg)
![Version](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20Python%20%7C%20IoT-orange)

Sakhi-Agri is a state-of-the-art, multi-service agricultural platform designed to empower farmers with real-time data, AI-driven insights, and a direct-to-consumer marketplace. By bridging the gap between physical IoT sensors and intelligent cloud analysis, Sakhi-Agri transforms traditional farming into data-driven precision agriculture.

---

## 🌟 Core Features

### 📡 Real-Time Telemetry Dashboard
*   **Live Sensor Feed**: Instant visualization of Soil Moisture, Water Levels (Ultrasonic), pH, NPK, and Humidity.
*   **Intelligent Sync**: Seamless communication between Arduino Mega hardware and the web dashboard via a high-performance WebSocket bridge.
*   **Hybrid Data Handling**: Real-time hardware telemetry combined with intelligent fallback simulation for missing sensor values.

### 🧠 AI & ML Insights
*   **Environment Prediction**: Machine Learning models (Random Forest) to analyze soil health and predict plant vitality.
*   **Computer Vision (YOLOv8)**: Real-time crop disease detection and diagnostic image analysis.
*   **Gemini Voice Assistant**: AI-powered multilingual voice guidance for hands-free agricultural support.

### 🛒 Integrated Farmers Marketplace
*   **P2P Trade**: Direct selling of fresh organic produce (vegetables, fruits) from farmers to consumers.
*   **Supply Hub**: Easy procurement of certified seeds, smart fertilizers, and high-tech irrigation equipment.
*   **Secure Registration**: Verified farmer profiles with complete inventory management.

---

## 🏗️ System Architecture

Sakhi-Agri follows a **Microservices-inspired Gateway Architecture** to ensure scalability and reliability:

1.  **Hardware Layer (Arduino Mega)**: Captures raw sensor data and streams it via Serial (USB).
2.  **IoT Bridge (Node.js)**: Reads Serial streams, parses JSON, and pushes data to the Gateway.
3.  **Gateway Server (Express.js)**: The central hub for Authentication (JWT/Bcrypt), WebSockets, and proxying AI requests.
4.  **AI Services (Flask)**: Dedicated Python services for ML inference, Computer Vision, and Generative AI (Gemini).
5.  **Frontend (Next.js 14)**: High-performance, responsive UI with modern glassmorphic design and real-time React state management.

---

## 📂 Project Structure

```text
Sakhi-Agri/
├── client/                 # Next.js 14 Frontend
│   ├── app/                # App Router (Dashboard, Sensors, Marketplace)
│   ├── components/         # Reusable UI Components & Visualizations
│   ├── contexts/           # State Management (Auth, Real-time Data)
│   └── public/             # Static Assets & Icons
├── server/                 # Node.js Gateway Backend
│   ├── src/
│   │   ├── routes/         # API Endpoints (Auth, Sensors, AI)
│   │   ├── models/         # MongoDB Schemas (Users, Marketplace)
│   │   └── services/       # WebSockets (Socket.io) & Core Logic
│   └── .env                # Server Configuration (Private)
├── hardware/               # IoT Source Code
│   ├── arduino_code.ino    # Arduino Mega Firmware
│   └── bridge.js           # Serial-to-HTTP Gateway Bridge
├── service-ai-env/         # ML Prediction Service (Python/Flask)
│   ├── app.py              # ML & Gemini Integration
│   └── models/             # Pre-trained .pkl Models
├── service-ai-diag/        # Computer Vision Service (YOLOv8)
│   ├── realtime_server.py  # YOLOv8 WebSocket Server
│   └── best.pt             # Custom Trained YOLO Weights
└── .gitignore              # Global Security Rules
```

---

## 🔐 Environment Configuration (.env)

For security, sensitive keys and local configurations are stored in `.env` files. **NEVER** push these to public repositories.

### 1. Server Gateway (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=4000
DATABASE_URL=your_mongodb_connection_string
SESSION_SECRET=your_long_random_secret_key
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

### 2. AI Service (`service-ai-env/.env`)
Create a `.env` file in the `service-ai-env` directory:
```env
GOOGLE_API_KEY=your_gemini_api_key
```

---

## 🛡️ Security & Git Best Practices

The following files are **STRICTLY EXCLUDED** from version control (see `.gitignore`):
*   `node_modules/` & `venv/`: Dependency folders (too large).
*   `.env`: Sensitive API keys and database credentials.
*   `*.log`: Local debug logs.
*   `__pycache__/`: Python compilation artifacts.
*   `build/` & `.next/`: Production build artifacts.

### How to handle updates:
1.  If you add a new environment variable, add it to this README but **NOT** the `.env` file in git.
2.  Use `git status` before committing to ensure no private files are staged.
3.  Always keep your `GOOGLE_API_KEY` private to avoid usage costs.

---

## 🚀 Installation & Running

Follow these steps in separate terminals:

### 1. Gateway Server
```bash
cd server
npm install
npm run dev
```

### 2. Frontend Application
```bash
cd client
npm install
npm run dev
```

### 3. AI Services (Python)
```bash
# Environment & ML Service
cd service-ai-env
pip install -r requirements.txt
python app.py

# Diagnostic (YOLO) Service
cd service-ai-diag
pip install -r requirements.txt
python realtime_server.py
```

### 4. IoT Hardware Bridge
```bash
cd hardware
node bridge.js
```
*(Ensure Arduino is connected to COM6 or update port in bridge.js)*

---

## 🔌 Hardware Setup

| Component | Pin (Arduino Mega) | Description |
| :--- | :--- | :--- |
| **Soil Moisture** | A0 | Analog input for ground moisture % |
| **Ultrasonic (Trig)**| 32 | Trigger pulse for water level |
| **Ultrasonic (Echo)**| 33 | Return pulse for water level |
| **Flow Sensor** | 2 | Interrupt-based flow rate tracking |
| **Relay (Pump)** | 7 | Digital output for pump control |

---

## 👨‍💻 Author
**Shadx-007 (Vikramjeet Maity)**  
**SrijanKapoor-28 (Ayush)**
**altaria1 (Srijan)**
*Advanced Agentic IoT & AI Specialist*
