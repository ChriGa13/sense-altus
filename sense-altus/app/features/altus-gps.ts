import document from 'document';
import { geolocation, PositionError } from 'geolocation';

export class AltusGPS {

    private gpsLabel: HTMLElement;
    private gpsData: HTMLElement;

    private gpsWatchId: number = 0;

    private readonly gpsTimeout = 60_000;
    
    constructor(gpsLabel: HTMLElement, gpsData: HTMLElement) {
        this.gpsLabel = gpsLabel;
        this.gpsData = gpsData;

        this.registerReconnectButtonCallback();
    }

    private registerReconnectButtonCallback(): void {
        const reconnectGPSButton = document.getElementById('reconnect-gps-button') as HTMLElement;
        reconnectGPSButton.addEventListener('click', _ => {
            this.startWatching();
        });
    }

    private locationSuccessCallback(position: Position): void {
        const gpsData = document.getElementById('gps-data') as HTMLElement;
        
        gpsData.text = position.coords.altitude + 'm';
    }
  
    private locationErrorCallback(error: PositionError): void {
        const gpsData = document.getElementById('gps-data') as HTMLElement;
        gpsData.text = 'Error while connecting';

        const reconnectGPSButton = document.getElementById('reconnect-gps-button') as HTMLElement;
        reconnectGPSButton.style.display = 'inline';
    }

    private showReconnectButton(show: boolean = true): void {
        const reconnectGPSButton = document.getElementById('reconnect-gps-button') as HTMLElement;
        reconnectGPSButton.style.display = show ? 'inline' : 'none';
    }

    public startWatching(): void {
        this.showReconnectButton(false);

        this.gpsWatchId = geolocation.watchPosition(
            this.locationSuccessCallback, 
            this.locationErrorCallback, 
            { timeout: this.gpsTimeout });
            
        this.gpsData.text = 'Connecting ...';
    }

    public stopWatching(): void {
        if(this.gpsWatchId != 0) {
            geolocation.clearWatch(this.gpsWatchId);
        }
    }
}