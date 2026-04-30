# 🌱 IoT Sensor Sentinels

A real-time **IoT-based smart agriculture monitoring system** that collects, simulates, and visualizes environmental data such as soil moisture, temperature, pH levels, phosphorus levels, and distance.

---

## 🚀 Features

* 📊 **Real-Time Dashboard**
  Live sensor data visualization with dynamic cards and trend graphs.

* 🔌 **Hardware Integration**
  Connects Arduino Mega via serial communication using a Node.js bridge.

* 🧠 **Data Simulation Mode**
  Generates realistic sensor data when hardware is not available.

* 🌐 **Backend Gateway**
  Handles WebSocket communication and database interactions.

* 🗄️ **Database Support**
  MongoDB integration with fallback for seamless local usage.

* 🎨 **Modern UI**
  Clean, responsive dashboard focused on empowering farmers.

---

## 🏗️ Project Structure

```
Sakhi-temp/
│
├── client/              # Frontend (Dashboard UI)
├── server/              # Backend (Gateway + Simulator)
├── hardware/            # Arduino bridge (Serial communication)
├── service-ai-env/      # AI-related services (if applicable)
├── service-ai-diag/     # Diagnostic services (if applicable)
└── README.md
```

---

## ⚙️ Running the Project

### 🔹 1. Start Backend (Gateway)

```bash
cd server
npm install
node src/server.js
```

* Runs on: **http://localhost:4000**
* Handles WebSockets + database

---

### 🔹 2. Start Frontend (Dashboard)

```bash
cd client
npm install
npm run dev
```

* Runs on: **http://localhost:3000**

---

### 🔹 3. Start Hardware Bridge (Arduino)

```bash
cd hardware
node bridge.js
```

* Connects Arduino Mega via serial port to backend

---

### 🔹 4. Start Data Simulator (No Hardware Mode)

```bash
cd server
node simulate_data.js
```

* Sends random sensor values every **3 seconds**
* Useful for testing UI without physical hardware

---

## 📡 Active Components

| Component       | URL / Status           |
| --------------- | ---------------------- |
| Frontend        | http://localhost:3000  |
| Backend Gateway | http://localhost:4000  |
| Data Simulator  | Running in background  |
| Hardware Bridge | Optional (for Arduino) |

---

## 📊 Sensor Data Tracked

* 🌱 Soil Moisture
* 🌡️ Temperature
* ⚗️ pH Level
* 🧪 Phosphorus Level
* 📏 Distance (Ultrasonic)

---

## 🧪 Modes of Operation

### ✅ Simulation Mode

* No hardware required
* Uses `simulate_data.js`

### 🔌 Hardware Mode

* Requires Arduino Mega
* Uses `bridge.js` for serial communication

---

## 🛠️ Tech Stack

* **Frontend:** React / Vite
* **Backend:** Node.js, Express
* **Real-Time:** WebSockets
* **Database:** MongoDB
* **Hardware:** Arduino Mega

---

## 💡 Future Improvements

* 📱 Mobile app integration
* 🤖 AI-based crop recommendations
* ☁️ Cloud deployment
* 📈 Advanced analytics dashboard

---

## 👨‍💻 Author

**Shadx-007 (Vikramjeet Maity)**

---

## ⚠️ Notes

* Ensure MongoDB is running or fallback is enabled
* Check correct COM port for Arduino in `bridge.js`
* Run all services in separate terminals

---

## 🎯 Summary

This project enables **real-time smart farming insights** by combining IoT, web technologies, and data simulation—making it both **practical and demo-ready**.

---

🔥 *Watch your data come alive in real-time!*
