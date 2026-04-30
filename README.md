# 🌱 Sakhi-Agri: Advanced IoT & AI-Powered Agriculture Platform

[![Status](https://img.shields.io/badge/Status-Active-success.svg)]()
[![License](https://img.shields.io/badge/License-MIT-blue.svg)]()
[![Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20MongoDB-black)]()

Sakhi-Agri is a comprehensive, production-ready smart agriculture monitoring system and marketplace. It seamlessly integrates real-time IoT hardware telemetry, AI-driven agricultural insights, and a fully functional peer-to-peer farmer's marketplace. 

Built with modern web technologies, Sakhi-Agri bridges the gap between traditional farming and digital agriculture.

---

## ✨ Key Features

### 📊 Real-Time IoT Telemetry Dashboard
- Live synchronization with Arduino Mega using WebSockets for ultra-low latency data transmission.
- Tracks critical environmental metrics: **Soil Moisture**, **Temperature**, **pH Levels**, **Nitrogen**, **Phosphorus**, and **Water Tank Distance**.
- Features an intelligent "Smart Fallback" system that smoothly simulates missing sensor data while strictly binding live components (like the Ultrasonic Water Level sensor) to actual hardware feeds.

### 🤖 AI-Driven Insights
- Real-time diagnostic alerts and yield optimization recommendations based on live sensor data.
- Capable of warning farmers about low water levels, high humidity risks, and sub-optimal soil nutrition.

### 🛒 Agricultural Marketplace
- **Direct-to-Consumer:** Farmers can register as verified sellers and list fresh produce (vegetables, fruits).
- **Supply Procurement:** Buy certified seeds, fertilizers, and smart agricultural equipment directly from the platform.
- Fully integrated with a MongoDB backend, allowing seamless farmer registration and inventory browsing.

### 🔐 Secure Authentication System
- Robust JWT and Bcrypt-based authentication utilizing a MongoDB session store.
- Protected routes to ensure marketplace listings and farmer dashboards remain secure.

---

## 🏗️ Architecture & Project Structure

The project relies on a decoupled, microservice-inspired architecture:

```text
Sakhi-temp/
│
├── client/              # Next.js 14 Frontend (React, Tailwind CSS, Lucide Icons)
├── server/              # Node.js/Express Backend Gateway (API, WebSockets, Auth)
├── hardware/            # Arduino scripts (.ino) and Node.js Serial Bridge (bridge.js)
├── service-ai-env/      # Future Python AI Microservice for Environment Prediction
└── service-ai-diag/     # Future Python AI Microservice for Crop Diagnostics
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (Local instance or Atlas URI)
- **Arduino IDE** (If connecting physical hardware)

### 1. Database Configuration
Ensure MongoDB is running locally on `mongodb://localhost:27017` or update the `MONGO_URI` in `server/.env`.

### 2. Start the Backend Gateway
The backend powers the authentication, database operations, and the WebSocket server.

```bash
cd server
npm install
npm run dev
```
*The server will start on `http://localhost:4000`.*

### 3. Start the Frontend Application
The Next.js frontend delivers the dashboard, marketplace, and insights UI.

```bash
cd client
npm install
npm run dev
```
*The application will be accessible at `http://localhost:3000`.*

### 4. Connect IoT Hardware (Arduino Bridge)
If you have the physical Arduino Mega connected with the ultrasonic and soil sensors:
1. Flash `hardware/arduino_code.ino` to your Arduino.
2. Ensure it is connected to the correct COM port (default is `COM6`).
3. Run the bridge script to stream serial data to the web application:

```bash
cd hardware
npm install
node bridge.js
```
*The bridge will automatically parse the raw serial strings and push them to the WebSocket gateway.*

---

## 🔌 Hardware Setup

The default configuration expects an **Arduino Mega**.
- **Ultrasonic Sensor (Water Level):** Echo Pin 11, Trig Pin 12
- **Soil Moisture Sensor:** Analog Pin A0
- **Relay Module (Water Pump):** Digital Pin 8

*Note: The hardware bridge (`bridge.js`) is designed to handle raw text streams (e.g., `Soil: 549 | Distance: 10 cm`) and safely convert them into JSON payloads for the backend.*

---

## 👨‍💻 Author

**Shadx-007 (Vikramjeet Maity)**

---

## 📄 License
This project is licensed under the MIT License.
