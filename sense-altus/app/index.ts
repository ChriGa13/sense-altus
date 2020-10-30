/*** UI Imports ***/
import { display } from "display";
import document from "document";

/*** Sensor Imports ***/
import { Barometer } from "barometer";
import { geolocation, PositionError } from "geolocation";

/*** Definitions ***/
const gpsTimeout = 60_000;
const barLabel = document.getElementById("bar-label");
const barData = document.getElementById("bar-data");
// const gpsLabel = document.getElementById("gps-label");
// const gpsData = document.getElementById("gps-data");
const sensors: any[] = [];

/*** Use Localization ***/
// https://dev.fitbit.com/build/guides/localization/

/*** Set Settings via App ***/
// https://dev.fitbit.com/build/guides/settings/

/*** Script ***/
if (Barometer) {
  // https://dev.fitbit.com/build/guides/sensors/barometer/
  const barometer = new Barometer({ frequency: 1 }); // returns atmospheric pressure in Pa (Pascal)
  
  if(barometer) {
    barometer.addEventListener("reading", () => {
    
      // math magic: https://de.wikipedia.org/wiki/Barometrische_H%C3%B6henformel
      if(barometer.pressure) {
        const height = Math.round((288.15 / 0.0065) * (1 - (Math.pow((barometer.pressure / (1013.25 * 100)), (1/ 5.255)))));
      
        if(barData) {
          barData.text = JSON.stringify({
            height: height + "m"
          });
        }
      }

    });
  }


} else {
  (barLabel as HTMLElement).style.display = "none";
  (barData as HTMLElement).style.display = "none";
}

// var watchID = geolocation.watchPosition(locationSuccessCallback, locationErrorCallback, { timeout: gpsTimeout });

function locationSuccessCallback(position: Position) {
  console.log("gps interval triggered");
  // gpsData.text = JSON.stringify({
  //   altitude: position.coords.altitude ? position.coords.altitude : "no gps altitude"
  // });
 
  console.log("Latitude: " + position.coords.latitude,
              "Longitude: " + position.coords.longitude,
              "Altitude: " + position.coords.altitude);
}

function locationErrorCallback(error: PositionError) {
  console.log("Error: " + error.code,
              "Message: " + error.message);
}

display.addEventListener("change", _ => {
  // Automatically stop all sensors when the screen is off to conserve battery
  if(display.on) {
    sensors.map(sensor => sensor.start());
    // geolocation.watchPosition(locationSuccessCallback, locationErrorCallback, { timeout: gpsTimeout });
  } else {
    sensors.map(sensor => sensor.stop());
    // geolocation.clearWatch(watchID);
  }
});
