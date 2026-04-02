import { registerPlugin } from '@capacitor/core';
import type { EventRaw } from './Type';


export interface LocalBackendPluginCapacitor {
    setURL(data: {url: string}): Promise<{}>;
    getUrl(): Promise<{url: string}>;
    getTheme(): Promise<{theme: string}>;
    setTheme(data: {theme: string}): Promise<{}>;
    getEvents(data: {time_difference: number}): Promise<{events: EventRaw[]}>;
}

export const LocalBackend = registerPlugin<LocalBackendPluginCapacitor>(
    'LocalBackend',
    {
        web: () => import('./WebTest').then(m => new m.MyNativeWeb()),
    }
);


