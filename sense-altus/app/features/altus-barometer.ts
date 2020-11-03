import { display } from 'display';
import { Barometer } from 'barometer';

interface NullableSensor {
    barometer?: Barometer;
}

export class AltusBarometer {

    private barLabel: HTMLElement;
    private barData: HTMLElement;

    private sensor: NullableSensor;
    private height: number = 0;

    get getHeight(): number { return this.height; }
    
    constructor(barLabel: HTMLElement, barData: HTMLElement) {
        this.barLabel = barLabel;
        this.barData = barData;

        if (Barometer) {
            // https://dev.fitbit.com/build/guides/sensors/barometer/
            this.sensor = { barometer: new Barometer({ frequency: 1 }) }; // returns atmospheric pressure in Pa (Pascal)
            if(this.sensor?.barometer) {
              this.sensor.barometer.addEventListener('reading', () => {
              
                // math magic: https://de.wikipedia.org/wiki/Barometrische_H%C3%B6henformel
                if(this.sensor.barometer?.pressure) {
                  this.height = Math.round((288.15 / 0.0065) * (1 - (Math.pow((this.sensor.barometer.pressure / (1013.25 * 100)), (1/ 5.255)))));
                  this.barData.text = JSON.stringify({
                    height: this.height + 'm',
                    pascal: this.sensor.barometer.pressure + 'pa'
                  });
                }
          
              });
            }
          } else {
              this.sensor = { };
              this.barLabel.style.display = 'none';
              this.barData.style.display = 'none';
          }
    }

    public isBarometerAvailable(): boolean {
        return this.sensor?.barometer !== null;
    }

    public start(): void {
        this.sensor?.barometer?.start();
    }

    public stop(): void {
        this.sensor?.barometer?.stop();
    }

    public addOnChangeEventListener(): void {
        display.addEventListener('change', _ => {
            display.on ? this.start() : this.stop();
        });
    }
}