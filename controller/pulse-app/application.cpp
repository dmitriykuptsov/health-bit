/**
 ******************************************************************************
 * @file    application.cpp
 * @authors Dmitriy Kuptsov
 * @date    16-March-2015
 * @brief   Pulse app
 ******************************************************************************
  Copyright (c) 2015 

  This program is free software; you can redistribute it and/or
  modify it under the terms of the GNU Lesser General Public
  License as published by the Free Software Foundation, either
  version 3 of the License, or (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
  Lesser General Public License for more details.

  You should have received a copy of the GNU Lesser General Public
  License along with this program; if not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************
 */

/* Includes ------------------------------------------------------------------*/  
#include "application.h"
int pulse   = 0;
int counter = 0;
long lag    = 0;

#define SAMPLES_PER_SECOND 1000
#define SAMPLES_PER_MINUTE SAMPLES_PER_SECOND * 60
#define DELAY 1000 / SAMPLES_PER_SECOND
#define MAX_VOLTAGE 3.3
#define THRESHOLD 3.0

/* This function is called once at start up ----------------------------------*/
void setup()
{
	//Register all functions
	//Spark.variable("pulse", &pulse, DOUBLE);
	//Connect to analog input
	pinMode(A7, INPUT);
}

/* This function loops forever --------------------------------------------*/
void loop()
{
  int reading = 0;
  double voltage = 0.0;
  reading = analogRead(A7);
  voltage = (reading * MAX_VOLTAGE) / 4095;
  if (voltage >= THRESHOLD) {
    pulse++;
  }

  counter++;
  //Reset counters 
  if (counter == SAMPLES_PER_MINUTE) {
    char buffer[11];
    sprintf(buffer, "%d", pulse);
    //Check if public function is a blocking function
    //If so, then there will be a lag, so we need to 
    //consider this
    //Publishing can occur at most once per second
    //We publish once per second
    long start = millis();
    Spark.publish("pulse", buffer);
    long end   = millis();
    lag = end - start;
    counter = 0;
    pulse   = 0;
  }

  //Adapt this
  if (lag > DELAY) {
    lag -= DELAY;
  } else {
    delay(DELAY - lag);
    lag = 0;
  }
}
