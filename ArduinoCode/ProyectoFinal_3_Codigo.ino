/** 
 * UF: TC1001S Herramientas computacionales: el arte de la programación (Grupo 101):
 * EQUIPO:
    A01634608 | Paul Enrique Alonso Ramírez
    A01639224 | Fausto Alejandro Palma Cervantes
    A01640473 | José Avir Gariel Guerrero
    A01640495 | Carlos Alberto Sanchez Villanueva 
 * THRESHOLDS: Los limites todos son 30 por defecto
**/

// INCLUDE LIBRARIES
#include <DHT.h>
#include <ESP8266WiFi.h>
#include "FirebaseESP8266.h"
#include <NTPClient.h>
#include <WiFiUdp.h>

// VARIABLES WIFI
// Casa
#define ssid "INFINITUM6DE3_2.4"
#define password "k4FJ6GfdJf"
// Telefono
// #define ssid "AndroidAPEFE9"
// #define password "blip8470"
// Tec
// #define ssid "Tec-IoT"
// #define password "spotless.magnetic.bridge"

// VARIABLES NTP CLIENT
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org");

// VARIABLES FIREBASE
#define API_KEY "AIzaSyCeicLSQJa0R729XlbWhgImQxsyuALV71I"
const char *FIREBASE_HOST="https://iot-semanatec-default-rtdb.firebaseio.com/"; 
const char *FIREBASE_AUTH="nKfEZmR7CIXo4BPGi28MSNBj3Yyjjvg46vH6DRRT";
FirebaseData firebaseData;
int cycleF = 5000; // Firebase
unsigned long nowF = 0;

// VARIABLES HC-SR04
#define Echo D0
#define Trigger D1
int cycleD = 1000; // Distancia
unsigned long nowD = 0;
int seco; // seg
int dist; // cm
int distanceThreshold = 0; // n para la verde, n/2 para la amarilla
#define LED_R D5
#define LED_G D6
#define LED_B D7

// VARIABLES LDR
#define LDR A0 
#define Emergency_LED D8
int cycleI = 1000; // Distancia
unsigned long nowI = 0;
int ligh = 0; // %
int darknessThreshold = 0;

// VARIABLES DHT11
#define DHTTYPE DHT11
#define DHTPIN D2
DHT dht(DHTPIN, DHTTYPE);
int cycleT = 1000; // Distancia
unsigned long nowT = 0;
int temp = 0;
int hotnessThreshold = 100;
#define FAN D3

// FUNCION SETUP
void setup() {
  // Configurar Monitor Serial
  Serial.begin(9600); 
  // Configurar Built-in LED
  pinMode(BUILTIN_LED, OUTPUT);
  digitalWrite(LED_BUILTIN, HIGH);
  // Configurar HC-SR04
  pinMode(Trigger, OUTPUT); 
  pinMode(Echo, INPUT);
  digitalWrite(Trigger, LOW);
  // Configurar Semaforo
  pinMode(LED_R, OUTPUT);
  pinMode(LED_G, OUTPUT);
  pinMode(LED_B, OUTPUT);
  // Configurar LDR
  pinMode(Emergency_LED, OUTPUT);
  pinMode(Emergency_LED, LOW);
  // Configurar DHT11
  dht.begin();
  pinMode(FAN, OUTPUT);
  // Configurar WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print("Conectando");
    for(int i = 0; i < 3; i++){
      delay(250);
      Serial.print(".");
    }
    delay(250);
    Serial.println();
  }
  Serial.println("CONECTADO A " + String(ssid) + " (IP: " + WiFi.localIP().toString() + ")");
  for(int i = 0; i < 3; i++){
    digitalWrite(LED_BUILTIN, LOW);
    delay(150);
    digitalWrite(LED_BUILTIN, HIGH);
    delay(150);
  }
  // Configurar Firebase
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.reconnectWiFi(true);
  // Configurar limites por defecto (Firebase)
  Firebase.setInt(firebaseData, "Limites/Lejania", distanceThreshold);
  Firebase.setInt(firebaseData, "Limites/Oscuridad", darknessThreshold);
  Firebase.setInt(firebaseData, "Limites/Calor", hotnessThreshold);
  Serial.println(" SET > [ LdD: 0 cm | LdI: 0% | LdC: 100 °C ]");
  // Configurar NTP
  timeClient.begin();
}

// FUNCION SEMAFORO
void semaforo(long d) {
  if (distanceThreshold == 0) {
    digitalWrite(LED_R, HIGH);
    digitalWrite(LED_G, HIGH);
    digitalWrite(LED_B, HIGH);
  } else if (d <= distanceThreshold/2) {
    digitalWrite(LED_R, LOW);
    digitalWrite(LED_G, HIGH);
    digitalWrite(LED_B, HIGH);
  } else if ((d > distanceThreshold/2) && (d <= distanceThreshold)) {
    digitalWrite(LED_R, LOW);
    digitalWrite(LED_G, LOW);
    digitalWrite(LED_B, HIGH);
  } else {
    digitalWrite(LED_R, HIGH);
    digitalWrite(LED_G, LOW);
    digitalWrite(LED_B, HIGH);
  }
}

// FUNCION DISTANCIA
void distancia() {
  digitalWrite(Trigger, HIGH);
  delayMicroseconds(10); // Pulso de 10us
  digitalWrite(Trigger, LOW);
  seco = pulseIn(Echo, HIGH); // Ancho del pulso
  dist = seco/59; // Escalar
  // Serial.println("Distancia: " + String(dist) + " cm"); // Imprimir
  semaforo(dist);
}

// FUNCION ILUMINACION
void iluminacion() {
  ligh = analogRead(LDR) * 100 / 1023; // luz (escalada*)
  if (ligh <= darknessThreshold) {
    for(int i = 0; i < 500; i++) {
      delay(cycleI/500);
      if(i < 250) {
        analogWrite(Emergency_LED, i+5); // Fade in
      } else {
        analogWrite(Emergency_LED, 505-i); // Fade out
      }
    }
  } else {
    digitalWrite(Emergency_LED, LOW);
  }
  // Serial.println("Iluminacion: " + String(ilum) + "%"); // Imprimir
}

// FUNCION TEMPERATURA
void temperatura() {
  temp = dht.readTemperature(); // temperatura (°C)
  if(temp >= hotnessThreshold) {
    digitalWrite(FAN, HIGH); // Encender ventilar
  } else {
    digitalWrite(FAN, LOW); // Apagar ventilar
  }
  // Serial.println("Temperatura: " + String(temp) + " °C"); // Imprimir
}

// FUNCION FUREBASE
void firebase() {
  // Actualizar NTP
  timeClient.update();
  unsigned long epoch = timeClient.getEpochTime();
  String nodo = String(epoch);
  // Exportar mediciones
  Firebase.setInt(firebaseData, "HC-SR04/" + nodo, dist);
  Firebase.setInt(firebaseData, "LDR/" + nodo, ligh);
  Firebase.setInt(firebaseData, "DHT11/" + nodo, temp);
  Serial.println(" SET > [ D: " + String(dist) + " cm | I: " + String(ligh) + "% | I: " + String(temp) + " °C ]");
  // Importar limites
  Firebase.getInt(firebaseData, "Limites/Lejania");
  distanceThreshold = firebaseData.intData();
  Firebase.getInt(firebaseData, "Limites/Oscuridad");
  darknessThreshold = firebaseData.intData();
  Firebase.getInt(firebaseData, "Limites/Calor");
  hotnessThreshold = firebaseData.intData();
  Serial.println(" GET < [ LdD: " + String(distanceThreshold) + " cm | LdI: " + String(darknessThreshold) + "% | LdC: " + String(hotnessThreshold) + " °C ]");
  // Parpadeo
  digitalWrite(LED_BUILTIN, LOW);
  delay(cycleF/50);
  digitalWrite(LED_BUILTIN, HIGH);
}

// FUNCION LOOP
void loop() {
  unsigned long now = millis();
  if (now - nowD > cycleD) {nowD = now;distancia();}
  if (now - nowI > cycleI) {nowI = now;iluminacion();}
  if (now - nowT > cycleT) {nowT = now;temperatura();}
  if (now - nowF > cycleF) {nowF = now;firebase();}
}
