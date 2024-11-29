/*
Project:  Cocktail Machine Testcode Screen and KY-040 Rotary Encoder
Author:   Thomas Edlinger for www.edistechlab.com
Date:     Created 29.11.2024 - update:
Version:  V1.0
IDE:      Arduino IDE 2.3.3
Required Board (Tools -> Board -> Boards Manager...)
Board:    ESP32S3 Dev Module / USB Connect on the right side "COM"
ESP:      ESP32-S3-DevKit N16R8
  - Board: esp32 by Espressif Systems V3.0.7

Required libraries (sketch -> include library -> manage libraries)
 - Adafruit GFX Library by Adafruit V1.11.11
 - Adafruit ST7735 Library by Adafruit V1.10.4
*/

#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>

// Pin definition
const uint8_t SPI_TFT_CS = 38;
const uint8_t TFT_DC = 3;
const int     TFT_RST = -1;  // Pin connected to the RST Pin
const uint8_t SPI_MOSI_Pin = 11;
const uint8_t SPI_CLK_Pin = 12;
const uint8_t encoderPin_CLK = 14;
const uint8_t encoderPin_DT = 10;
const uint8_t encoderPin_SW = 41;

// Variables
int counter = 0;
int lastStateCLK;
int currentStateCLK;
int lastButtonState = HIGH;
int currentButtonState = HIGH;
unsigned long lastDebounceTime = 0;  // Time of the last button state change
const unsigned long debounceDelay = 50; // Debounce delay in milliseconds
String direction = "Stopped";  // Store the direction
String buttonState = "Released"; // Store the button state

// Initialize the ST7735 display library with previously defined connections
Adafruit_ST7735 tft = Adafruit_ST7735(SPI_TFT_CS, TFT_DC, TFT_RST);

void setup() {
  // Initialize Serial Monitor
  Serial.begin(115200);

  // Initialize the ST7735 TFT display
  Serial.println("Initializing display...");
  tft.initR(INITR_BLACKTAB); // Init ST7735S chip, black tab
  tft.setRotation(3);       // Rotate screen by 180 degrees
  tft.fillScreen(ST7735_BLACK); // Fill screen with black color
  Serial.println("Display initialized.");
    
  // Define pin modes
  pinMode(encoderPin_CLK, INPUT);
  pinMode(encoderPin_DT, INPUT);
  pinMode(encoderPin_SW, INPUT_PULLUP); // Enable internal pull-up resistor

  // Initial state of the CLK pin
  lastStateCLK = digitalRead(encoderPin_CLK);

  // Set text color and background
  Serial.println("Setting text color and background...");
  tft.setTextColor(ST7735_WHITE, ST7735_BLACK); // White text with black background
  Serial.println("Setup complete.");

  // Initial display setup
  tft.setCursor(0, 0);
  tft.print("Direction: ");
  tft.setCursor(0, 20);
  tft.print("Button: ");
  tft.setCursor(0, 40);
  tft.print("Counter: 0");
}

void loop() {
  // Detect rotary encoder direction
  currentStateCLK = digitalRead(encoderPin_CLK);
  
  if (currentStateCLK != lastStateCLK) {
    if (digitalRead(encoderPin_DT) != currentStateCLK) {
      counter++;
      direction = "Forward";
    } else {
      counter--;
      direction = "Backward";
    }
    // Update display with direction and counter
    tft.fillRect(80, 0, 60, 10, ST7735_BLACK); // Clear previous direction
    tft.setCursor(80, 0);
    tft.print(direction);

    tft.fillRect(80, 40, 60, 10, ST7735_BLACK); // Clear previous counter
    tft.setCursor(80, 40);
    tft.print(counter);

    Serial.print("Direction: ");
    Serial.print(direction);
    Serial.print(", Counter: ");
    Serial.println(counter);
  }
  lastStateCLK = currentStateCLK;

  // Read the button state
  int reading = digitalRead(encoderPin_SW);

  // Check if the button state has changed
  if (reading != lastButtonState) {
    // Reset debounce timer
    lastDebounceTime = millis();
  }

  // Only consider the button state if the debounce delay has passed
  if ((millis() - lastDebounceTime) > debounceDelay) {
    // If the button state has stabilized, update the current button state
    if (reading != currentButtonState) {
      currentButtonState = reading;

      // Detect button press (transition from HIGH to LOW)
      if (currentButtonState == LOW) {
        buttonState = "Pressed";
        Serial.println("Button pressed!");
      } else {
        buttonState = "Released";
      }

      // Update display with button state
      tft.fillRect(80, 20, 60, 10, ST7735_BLACK); // Clear previous button state
      tft.setCursor(80, 20);
      tft.print(buttonState);
    }
  }

  // Save the last button state for the next iteration
  lastButtonState = reading;
}