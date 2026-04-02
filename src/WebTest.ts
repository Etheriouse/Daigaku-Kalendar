import type { LocalBackendPluginCapacitor } from "./CapacitorPlugin";

export class MyNativeWeb implements LocalBackendPluginCapacitor {

    async setURL({ url }: { url: string }) {
        localStorage.setItem("ics_url", url);
        return {};
    }

    async getUrl() {
        return {
            url: localStorage.getItem("ics_url") || "HELOOO",
        };
    }

    async setTheme({ theme }: { theme: string }) {
        localStorage.setItem("theme", theme);
        return {};
    }

    async getTheme() {
        return {
            theme: localStorage.getItem("theme") || "dark",
        };
    }

    async getEvents({ time_difference }: { time_difference: number }) {
        const now = new Date();

        return {
            events: [
                {
                    title: "Event Web",
                    start: "20260402T080019Z",//new Date(now.getTime() + time_difference).toISOString(),
                    end: "20260402T094519Z",//new Date(now.getTime() + time_difference + 3600000).toISOString(),
                    location: "Web",
                    description: "Local",
                    color: "#4d79ff",
                },
            ],
        };
    }
}