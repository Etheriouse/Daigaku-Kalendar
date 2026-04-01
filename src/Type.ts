export type ScheduleType = "month" | "week" | "day";
export type EventParse = {title: string, start: string, end: string, day: number, location: string, description: string, color: string};
export type Event = {name: string, start: Date, end: Date, location: string, description: string, color: string};
export type EventRaw = {title: string, color: string, location: string, description: string, start: string, end: string};