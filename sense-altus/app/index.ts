/*** UI Imports ***/
import document from 'document';

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

const reconnectGPSButton = document.getElementById('reconnect-gps-button');

/*** Settings Script ***/
const settingsCallback = function (settings: SenseAltusSettings): void {
  if(settings?.color) {
    (barData as HTMLElement).style.fill = settings.color;
    (gpsData as HTMLElement).style.fill = settings.color;
    (reconnectGPSButton as HTMLElement).style.fill = settings.color;
  }
};

const settingsService = new SettingsService(settingsCallback);
settingsService.initialize();

/*** Barometer Script ***/
const barometer: AltusBarometer = 
  new AltusBarometer(
    settingsService,
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
