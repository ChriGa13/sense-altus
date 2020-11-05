// @ts-ignore
import { settingsStorage } from 'settings';
// @ts-ignore
import * as messaging from 'messaging';
// @ts-ignore
import { me as companion } from 'companion';

import { environment as env } from '../app/services/environment';

// Settings have been changed
settingsStorage.addEventListener('change', (evt) => {
  if(evt.oldValue !== evt.newValue) {
    sendValue(evt.key, evt.newValue);
  }
});

// TODO: does not work when device has no connection (runs into 'No peerSocket connection')
// Settings were changed while the companion was not running
if (companion.launchReasons.settingsChanged) {
  // Send the value of the setting
  sendValue(env.settingsKeys.color, settingsStorage.getItem(env.settingsKeys.color));
}

// TODO (interim solution): send all settings every time the socket connection is 'open'
messaging.peerSocket.addEventListener('open', (evt) => {
  Object.keys(env.settingsKeys).forEach(key => {
    sendValue(key, settingsStorage.getItem(key));
  });
});

// HELPER FUNCTIONS:
function sendValue(key, val) {
  if (val) {
    sendSettingData({
      key: key,
      value: JSON.parse(val)
    });
  }
}

function sendSettingData(data) {
  // If we have a MessageSocket, send the data to the device
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    messaging.peerSocket.send(data);
  } else {
    console.log('No peersocket connection ...');
  }
}
