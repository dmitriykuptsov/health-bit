/**
 ******************************************************************************
 * @file    application.cpp
 * @authors  Dmitriy Kuptsov
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
int pulse = 0;
/* This function is called once at start up ----------------------------------*/
void setup()
{
	//Register all functions
	Spark.variable("pulse", &pulse, DOUBLE);
	//Connect to analog input
	pinMode(A7, INPUT);
}

/* This function loops forever --------------------------------------------*/
void loop()
{
	int reading = 0;
	double voltage = 0.0;
	reading = analogRead(A7);
	voltage = (reading * 3.3) / 4095;
	//Adapt this
	pulse = floor((voltage - 0.5) * 100);
}
