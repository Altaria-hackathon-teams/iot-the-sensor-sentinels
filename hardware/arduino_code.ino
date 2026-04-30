/* =========================
SAKHI AGRI FINAL SETUP
======================

IMPORTANT:

* Arduino Mega DOES NOT use WiFi
* Your laptop is connected to hotspot (GalaxyA54)
* Node.js sends data to backend

========================= */

/* =========================
ARDUINO CODE (.ino FILE)
========================= */

#define SOIL_PIN A0
#define RELAY_PIN 7
#define FLOW_PIN 2
#define TRIG_PIN 32
#define ECHO_PIN 33

volatile int pulseCount = 0;
float flowRate = 0;

void pulseCounter() { pulseCount++; }

void setup() {
  Serial.begin(9600);

  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, LOW);

  pinMode(FLOW_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(FLOW_PIN), pulseCounter, RISING);

  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}

long readDistance() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(5);

  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH, 30000);
  if (duration == 0)
    return -1;

  return duration * 0.034 / 2;
}

void loop() {
  int soilRaw = analogRead(SOIL_PIN);
  int soilPercent = map(soilRaw, 1023, 0, 0, 100);

  pulseCount = 0;
  delay(1000);
  flowRate = pulseCount / 7.5;

  int distance = readDistance();

  Serial.print("{");
  Serial.print("\"soil\":");
  Serial.print(soilPercent);
  Serial.print(",\"distance\":");
  Serial.print(distance);
  Serial.print(",\"flow\":");
  Serial.print(flowRate);
  Serial.println("}");

  if (distance == -1 || distance > 30) {
    digitalWrite(RELAY_PIN, LOW);
  } else if (soilPercent < 30) {
    digitalWrite(RELAY_PIN, HIGH);
  } else {
    digitalWrite(RELAY_PIN, LOW);
  }

  if (flowRate < 1) {
    digitalWrite(RELAY_PIN, LOW);
  }

  delay(2000);
}

/* =========================
NODE.JS BRIDGE (RUN ON LAPTOP)
========================= */

/*
YOUR WIFI:
SSID = GalaxyA54
PASSWORD = abcs1234

Your laptop is already connected to this WiFi.
Arduino does NOT use this.
*/

const SerialPort = require("serialport");
const Readline = require("@serialport/parser-readline");
const axios = require("axios");

const port = new SerialPort("COM6", {baudRate : 9600}); // change COM if needed
const parser = port.pipe(new Readline({delimiter : "\n"}));

parser.on(
    "data", async(line) = > {
      try {
        const data = JSON.parse(line);
        console.log("Sending:", data);

        ``` await axios.post("http://localhost:4000/api/sensors/data", data);
        ```

      } catch {
        console.log("Invalid:", line);
      }
    });
