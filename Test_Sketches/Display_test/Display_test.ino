/*
Project:  Cocktail Machine Testcode Screen
Author:   Thomas Edlinger for www.edistechlab.com
Date:     Created 28.11.2024 - update:
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

// Initialize the ST7735 display library with previously defined connections
Adafruit_ST7735 tft = Adafruit_ST7735(SPI_TFT_CS, TFT_DC, TFT_RST);

void setup() {
    // Initialize Serial Monitor
    Serial.begin(115200);
    Serial.println("Setup started...");

    // Initialize the ST7735 TFT display
    Serial.println("Initializing display...");
    tft.initR(INITR_BLACKTAB); // Init ST7735S chip, black tab
    tft.setRotation(3);       // Rotate screen by 180 degrees
    tft.fillScreen(ST7735_BLACK); // Fill screen with black color

    Serial.println("Display initialized.");
    
    // Set text color and background
    Serial.println("Setting text color and background...");
    tft.setTextColor(ST7735_WHITE, ST7735_BLACK); // White text with black background

    // Set text size
    Serial.println("Setting text size...");
    tft.setTextSize(1); // Smallest text size

    // Calculate the position to center the text
    int16_t x = (tft.width() - (strlen("CocktailCrafter") * 6 * 1)) / 2; // 6 pixels width per character, times text size
    int16_t y = (tft.height() - (8 * 1)) / 2; // 8 pixels height per line, times text size

    // Draw the text
    Serial.println("Displaying text on the screen...");
    tft.setCursor(x, y);
    tft.print("CocktailCrafter");

    Serial.println("Setup complete.");
}

void loop() {
    // Nothing to do in the loop
}

