import { registerPlugin } from '@capacitor/core';
import type { EventRaw } from './Type';


export interface LocalBackendPluginCapacitor {
    setURL(data: {url: string}): Promise<{}>;
    getUrl(): Promise<{url: string}>;
    getEvents(data: {time_difference: number}): Promise<{events: EventRaw[]}>;
}

export const LocalBackend = registerPlugin<LocalBackendPluginCapacitor>('LocalBackend')/*, {
    web: () => import('./MyNative').then(m => new m.MyNativeWeb()),
});*/
