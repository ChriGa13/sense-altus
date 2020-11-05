/*** UI Imports ***/
import document from 'document';

/*** General Imports ***/
import * as messaging from 'messaging';

/*** Sensor Imports ***/
import { AltusBarometer } from './features/altus-barometer';
import { AltusGPS } from './features/altus-gps';
import { SenseAltusSettings, SettingsService } from './services/settings-service';

/*** Use Localization ***/
// https://dev.fitbit.com/build/guides/localization/

/*** Set Settings via App ***/
// https://dev.fitbit.com/build/guides/settings/

/*** Definitions ***/
const barLabel = document.getElementById('bar-label');
const barData = document.getElementById('bar-data');

const gpsLabel = document.getElementById('gps-label');
const gpsData = document.getElementById('gps-data');

/*** Settings Script ***/

const settingsCallback = function (settings: SenseAltusSettings): void {
  if(settings?.textColor) {
    (barData as HTMLElement).style.fill = settings.textColor;
    (gpsData as HTMLElement).style.fill = settings.textColor;
  }
};

const settingsService = new SettingsService(settingsCallback);
settingsService.initialize();

// messaging.peerSocket.addEventListener("message", (event) => {
//   const messageEvent = event as MessageEvent;
//   if (messageEvent && messageEvent.data && messageEvent.data.key === "myColor") {
//     (barData as HTMLElement).style.fill = messageEvent.data.value;
//     (gpsData as HTMLElement).style.fill = messageEvent.data.value;
//   }
// });

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
