/*
Project:  Cocktail Machine Testcode KY-040 Rotary Encoder
Author:   Thomas Edlinger for www.edistechlab.com
Date:     Created 29.11.2024 - update:
Version:  V1.0
IDE:      Arduino IDE 2.3.3
Required Board (Tools -> Board -> Boards Manager...)
Board:    ESP32S3 Dev Module / USB Connect on the right side "COM"
ESP:      ESP32-S3-DevKit N16R8
  - Board: esp32 by Espressif Systems V3.0.7

Required libraries (sketch -> include library -> manage libraries)
 - 
*/

// Pin definition
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

void setup() {
  Serial.begin(115200);
  
  // Define pin modes
  pinMode(encoderPin_CLK, INPUT);
  pinMode(encoderPin_DT, INPUT);
  pinMode(encoderPin_SW, INPUT_PULLUP); // Enable internal pull-up resistor

  // Initial state of the CLK pin
  lastStateCLK = digitalRead(encoderPin_CLK);
}

void loop() {
  // Detect rotary encoder direction
  currentStateCLK = digitalRead(encoderPin_CLK);
  
  if (currentStateCLK != lastStateCLK) {
    if (digitalRead(encoderPin_DT) != currentStateCLK) {
      counter++;
      Serial.print("Direction: Forward, Counter: ");
    } else {
      counter--;
      Serial.print("Direction: Backward, Counter: ");
    }
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
        Serial.println("Button pressed!");
      }
    }
  }

  // Save the last button state for the next iteration
  lastButtonState = reading;
}
