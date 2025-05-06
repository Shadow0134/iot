#include <Wire.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <Adafruit_MPU6050.h>
#include <Adafruit_Sensor.h>

// WiFi credentials - Ayush Shrikhande
const char* ssid = "Recover.Me-125969";
const char* password = "kj3e8szdxf6c5r9";

// Server URL - Ayush Shrikhande
const char* serverName = "http://192.168.244.200:3001/api/sensor";

// // WiFi credentials - Anvesh Khode
// const char* ssid = ":(";
// const char* password = "abababab";

// // // Server URL - Anvesh Khode
// const char* serverName = "http://192.168.128.121:3001/api/sensor";



// Flex sensor pins (final assignment)
const int flexPin_SP = 34;  // SP → GPIO34
const int flexPin_G34 = 35; // G34 → GPIO35
const int flexPin_G32 = 32; // G32 → GPIO32


Adafruit_MPU6050 mpu;

void setup() {
  Serial.begin(115200);

  // Setup WiFi
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi...");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi!");

  // Initialize MPU6050
  if (!mpu.begin()) {
    Serial.println("MPU6050 not connected!");
    while (1) delay(10);
  }
  Serial.println("MPU6050 connected!");
}

void loop() {
  // Read flex sensors
  int flexValue1 = analogRead(flexPin_SP);
  int flexValue2 = analogRead(flexPin_G34);
  int flexValue3 = analogRead(flexPin_G32);

  // Read MPU6050 sensor
  sensors_event_t accel, gyro, temp;
  mpu.getEvent(&accel, &gyro, &temp);

  // Construct JSON payload
  String jsonData = "{";
  jsonData += "\"flex\":[";
  jsonData += String(flexValue1) + ",";
  jsonData += String(flexValue2) + ",";
  jsonData += String(flexValue3) + "],";
  jsonData += "\"gyro\":{";
  jsonData += "\"x\":" + String(gyro.gyro.x, 2) + ",";
  jsonData += "\"y\":" + String(gyro.gyro.y, 2) + ",";
  jsonData += "\"z\":" + String(gyro.gyro.z, 2);
  jsonData += "}}";

  // HTTP POST request
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonData);

    Serial.println("Payload Sent: " + jsonData);
    Serial.print("Response Code: ");
    Serial.println(httpResponseCode);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println("Server Response: " + response);
    } else {
      Serial.println("HTTP Error!");
    }

    http.end();
  } else {
    Serial.println("WiFi disconnected!");
  }

  delay(500);  // Adjusted to 500ms to avoid flooding
}
