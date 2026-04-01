export type ScheduleType = "month" | "week" | "day";
export type EventParse = {title: string, start: string, end: string, day: Number, location: string, author: string, color: string};
export type Event = {name: string, start: Date, end: Date, location: string, author: string, color: string};
export type EventRaw = {title: string, color: string, location: string, author: string, start: string, end: string};