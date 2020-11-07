import { me } from 'appbit';
import { me as device } from 'device';
import * as fs from 'fs';
import * as messaging from 'messaging';

import { environment as env } from './environment';

export interface SenseAltusSettings {
    color?: string;
    isTemperatureEnabled?: boolean;
    temperature?: number;
}

export interface OnSettingsChangeCallback {
    (settings: SenseAltusSettings)
}

type Encoding = 'cbor' | 'json';

export class SettingsService {
    private readonly SETTINGS_TYPE: Encoding = 'json';
    private readonly SETTINGS_FILE: string = 'sense-altus-sav.json';

    private settings: SenseAltusSettings;
    private onSettingsChange: OnSettingsChangeCallback;

    constructor(callback: OnSettingsChangeCallback) {
        this.settings = this.loadSettings();

        this.onSettingsChange = callback;
        this.onSettingsChange(this.settings);
    }

    public initialize(): void {
        // Received message containing settings data
        messaging.peerSocket.addEventListener('message', (event) => {
            const messageEvent = event as MessageEvent;
            if (messageEvent && messageEvent.data) {
                if(this.settings == null) {
                    this.settings = {
                        color: undefined,
                        isTemperatureEnabled: false,
                        temperature: 0
                    };
                }
                switch(messageEvent.data.key) {
                    case 'color': this.settings.color = messageEvent.data.value;
                    case 'isTemperatureEnabled': this.settings.isTemperatureEnabled = messageEvent.data.value;
                    case 'temperature': this.settings.temperature = messageEvent.data.value;
                }

                this.onSettingsChange(this.settings);
            }
        });
        
        // Register for the unload event
        me.addEventListener('unload', () => { this.saveSettings(this.SETTINGS_FILE, this.SETTINGS_TYPE, this.settings) });
    }

    // Load settings from filesystem
    private loadSettings(): SenseAltusSettings {
        try {
            return fs.readFileSync(this.SETTINGS_FILE, this.SETTINGS_TYPE) as SenseAltusSettings;
        } catch (error) {
            return {} as SenseAltusSettings;
        }
    }

    // Save settings to the filesystem
    private saveSettings(file: string, type: Encoding, settings: SenseAltusSettings): void {
        try {
            fs.writeFileSync(file, settings, type);
        } catch (error) {
            console.log('Error while saving settings: ' + error);
        }
    }

    public getCurrentSettings(): SenseAltusSettings { return this.settings; }
}