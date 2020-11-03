/*** UI Imports ***/
import document from 'document';

/*** General Imports ***/
import * as messaging from 'messaging';

/*** Sensor Imports ***/
import { AltusBarometer } from './features/altus-barometer';
import { AltusGPS } from './features/altus-gps';

/*** Use Localization ***/
// https://dev.fitbit.com/build/guides/localization/

/*** Set Settings via App ***/
// https://dev.fitbit.com/build/guides/settings/

/*** Definitions ***/
const barLabel = document.getElementById('bar-label');
const barData = document.getElementById('bar-data');

const gpsLabel = document.getElementById('gps-label');
const gpsData = document.getElementById('gps-data');


/*** Barometer Script ***/
const barometer: AltusBarometer = 
  new AltusBarometer(
    (barLabel as HTMLElement), 
    (barData as HTMLElement)
  );

if(barometer.isBarometerAvailable()) {
  barometer.addOnChangeEventListener();
  barometer.start();
}

/*** GPS Script ***/
const gps: AltusGPS = 
  new AltusGPS(
      (gpsLabel as HTMLElement), 
      (gpsData as HTMLElement)
  );

gps.startWatching();

/*** Settings Script ***/

// Message is received
messaging.peerSocket.onmessage = evt => {
  console.log(`App received: ${JSON.stringify(evt)}`);
  if (evt.data.key === "color" && evt.data.newValue) {
    let color = JSON.parse(evt.data.newValue);
    console.log(`Setting background color: ${color}`);
  }
};

// Message socket opens
messaging.peerSocket.onopen = () => {
  console.log("App Socket Open");
};

// Message socket closes
messaging.peerSocket.onclose = () => {
  console.log("App Socket Closed");
};
