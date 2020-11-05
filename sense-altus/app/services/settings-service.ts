import { me } from 'appbit';
import { me as device } from 'device';
import * as fs from 'fs';
import * as messaging from 'messaging';

export interface SenseAltusSettings {
    textColor?: string;
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
        console.log('loading: ' + this.settings);
        this.onSettingsChange = callback;
        this.onSettingsChange(this.settings);
    }

    public initialize(): void {
        // Received message containing settings data
        messaging.peerSocket.addEventListener('message', (event) => {
            const messageEvent = event as MessageEvent;
            if (messageEvent && messageEvent.data && messageEvent.data.key === 'myColor') {
                console.log('oncolorchange');
                if(this.settings == null) {
                    this.settings = {
                        textColor: undefined
                    };
                }
                this.settings.textColor = messageEvent.data.value;
                console.log('settings changed: ' +  this.settings);
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
        } catch (ex) {
            return {} as SenseAltusSettings;
        }
    }

    // Save settings to the filesystem
    private saveSettings(file: string, type: Encoding, settings: SenseAltusSettings): void {
        console.log('saving: ' + file + ' ' + type);
        try {
            fs.writeFileSync(file, settings, type);
        } catch(error) {
            console.log('save error: ' + error);
        }
    }
}